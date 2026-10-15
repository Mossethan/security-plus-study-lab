const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path');
const root = path.join(__dirname, '..');
const ownerA = '11111111-1111-4111-8111-111111111111', ownerB = '22222222-2222-4222-8222-222222222222';
const key = 'security-messer-v1';
function environment(saved = {}, backend = {row: null}, sessionUser = ownerA) {
  const listeners = {}, nodes = new Map(); let changeAuth, calls = 0, reloads = 0;
  const node = id => nodes.get(id) || null;
  const server = {
    auth: {
      getSession: async () => ({data: {session: sessionUser ? {user: {id: sessionUser, email: 'study@example.com'}} : null}}),
      onAuthStateChange: fn => { changeAuth = fn; },
      signInWithOAuth: async () => ({error: null}), signOut: async () => ({error: null})
    },
    from: () => ({select: () => ({eq: (field, id) => ({maybeSingle: async () => {
      if (backend.offline) throw Error('offline');
      if (backend.readHook) { const hook = backend.readHook; backend.readHook = null; await hook(); }
      assert.equal(id, sessionUser); return {data: backend.row ? structuredClone(backend.row) : null, error: null};
    }})})}),
    rpc: async (name, args) => {
      calls++; assert.equal(name, 'save_study_progress');
      if (backend.offline) throw Error('offline');
      if (backend.writeHook) { const hook = backend.writeHook; backend.writeHook = null; await hook(); }
      if ((backend.row?.revision || 0) !== args.expected_revision) return {data: {conflict: true}};
      backend.row = {revision: args.expected_revision + 1, data: structuredClone(args.progress), updated_at: new Date().toISOString()};
      return {data: {revision: backend.row.revision, updated_at: backend.row.updated_at}};
    }
  };
  const c = {
    console, JSON, Object, Array, Set, Map, Date, URL, Blob, navigator: {onLine: true},
    CustomEvent: class { constructor(type, opts) { this.type = type; this.detail = opts?.detail; } },
    localStorage: {getItem: k => saved[k] ?? null, setItem: (k, v) => { if (backend.storageBlocked) throw Error('quota'); saved[k] = v; }, removeItem: k => delete saved[k]},
    location: {pathname: '/index.html', href: 'https://mossethan.github.io/security-plus-study-lab/index.html', reload() {reloads++;}, replace() {}},
    document: {hidden: false, activeElement: null, getElementById: node, addEventListener() {}},
    setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1,
    window: {STUDY_SYNC_CONFIG: {url: 'https://example.supabase.co', publishableKey: 'public'}, supabase: {createClient: () => server}, StudyApp: {reload: () => reloads++},
      addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
      dispatchEvent(event) { for (const fn of listeners[event.type] || []) fn(event); },
      scrollTo() {}, confirm: () => true, scrollX: 0, scrollY: 0}
  };
  vm.createContext(c);
  for (const file of ['study-storage.js', 'sync-core.js', 'account-sync.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), c, {filename: file});
  return {saved, backend, context: c, run: src => vm.runInContext(src, c), get calls() {return calls;}, get reloads() {return reloads;}, nodes};
}
function plain(value) {return JSON.parse(JSON.stringify(value));}
function snapshot(notes, answers = {}) {return {[key]: {lessons: {'security-controls': {notes, watched: true, answers, choices: {}, matches: {}, checked: false, best: null, bestTotal: 10}}, last: 'security-controls'}};}
async function main() {
  const e = environment();
  // Different account workspaces and the guest's original data never leak into one another.
  e.run(`StudyStorage.setItem('${key}', JSON.stringify({lessons:{guest:{notes:'guest only'}}}));StudyStorage.switchOwner('${ownerA}');`);
  assert.equal(e.run(`StudyStorage.getItem('${key}')`), null);
  e.run(`StudyStorage.setItem('${key}', JSON.stringify({lessons:{a:{notes:'A only'}}}));StudyStorage.switchOwner('${ownerB}');`);
  assert.equal(e.run(`StudyStorage.getItem('${key}')`), null);
  e.run(`StudyStorage.switchOwner('${ownerA}')`); assert(e.run(`StudyStorage.getItem('${key}')`).includes('A only'));
  assert(e.run(`StudyStorage.snapshot('guest')['${key}'].lessons.guest.notes`) === 'guest only');
  e.context.snap = snapshot('original', {0: 1});
  e.run('var base=StudySyncCore.pack(snap);');
  assert.deepEqual(plain(e.run('StudySyncCore.pack(StudySyncCore.unpack(base))')), plain(e.run('base')));
  e.context.local = snapshot('new notes', {0: 1}); e.context.remote = snapshot('original', {0: 1, 1: 2});
  let merge = plain(e.run('StudySyncCore.merge(base,StudySyncCore.pack(local),StudySyncCore.pack(remote))'));
  assert.equal(merge.conflicts.length, 0, 'Notes and answers merge independently');
  e.context.units = merge.units;
  let out = plain(e.run(`StudySyncCore.unpack(units)['${key}'].lessons['security-controls']`));
  assert.equal(out.notes, 'new notes'); assert.equal(out.answers[1], 2);
  e.context.local = snapshot('different local', {0: 1}); e.context.remote = snapshot('different remote', {0: 1});
  merge = plain(e.run('StudySyncCore.merge(base,StudySyncCore.pack(local),StudySyncCore.pack(remote))'));
  assert.equal(merge.conflicts.length, 1, 'Divergent notes require a choice');
  e.context.choices = {[merge.conflicts[0].key]: 'cloud'};
  assert.equal(e.run(`StudySyncCore.unpack(StudySyncCore.merge(base,StudySyncCore.pack(local),StudySyncCore.pack(remote),choices).units)['${key}'].lessons['security-controls'].notes`), 'different remote');
  // Retry on one device and a changed answer on another must not create a hybrid attempt.
  e.context.local = snapshot('original', {}); e.context.remote = snapshot('original', {0: 1, 1: 2});
  assert.equal(e.run('StudySyncCore.merge(base,StudySyncCore.pack(local),StudySyncCore.pack(remote)).conflicts.length'), 1);
  assert.throws(() => e.run(`StudySyncCore.validate(JSON.parse('{"${key}":{"__proto__":{"x":true}}}'))`));
  assert.throws(() => e.run(`StudySyncCore.validate({'unrelated-key':{}})`));
  // Pull on a second device, send disjoint edits, then verify no update is lost.
  const backend = {row: null}, a = environment({}, backend), b = environment({}, backend);
  await a.run('StudySync.start()'); a.context.snapshot = snapshot('typed on desktop', {0: 1});
  a.run('StudyStorage.replace(snapshot)'); await a.run('StudySync.sync()');
  assert.equal(backend.row.revision, 1);
  await b.run('StudySync.start()'); assert.equal(b.run(`StudyStorage.snapshot()['${key}'].lessons['security-controls'].notes`), 'typed on desktop');
  b.run(`var s=StudyStorage.snapshot();s['${key}'].lessons['security-controls'].answers[1]=2;StudyStorage.replace(s)`);
  a.run(`var s=StudyStorage.snapshot();s['${key}'].lessons['security-controls'].notes='more typing';StudyStorage.replace(s)`);
  await b.run('StudySync.sync()'); await a.run('StudySync.sync()'); await b.run('StudySync.sync()');
  for (const device of [a, b]) {
    assert.equal(device.run(`StudyStorage.snapshot()['${key}'].lessons['security-controls'].notes`), 'more typing');
    assert.equal(device.run(`StudyStorage.snapshot()['${key}'].lessons['security-controls'].answers[1]`), 2);
  }
  const revision = backend.row.revision; await a.run('StudySync.sync()'); assert.equal(backend.row.revision, revision, 'Identical state does not upload');
  // True conflicts stop the write; offline saves can be retried after reconnection.
  a.run(`var s=StudyStorage.snapshot();s['${key}'].lessons['security-controls'].notes='desktop divergence';StudyStorage.replace(s)`);
  b.run(`var s=StudyStorage.snapshot();s['${key}'].lessons['security-controls'].notes='tablet divergence';StudyStorage.replace(s)`);
  await a.run('StudySync.sync()'); const before = backend.row.revision; await b.run('StudySync.sync()');
  assert.equal(backend.row.revision, before, 'Conflicting device never overwrites cloud silently');
  const offline = environment({}, {row: null, offline: true}); await offline.run('StudySync.start()');
  offline.context.snapshot = snapshot('offline notes'); offline.run('StudyStorage.replace(snapshot)'); await offline.run('StudySync.sync()');
  assert.equal(offline.run(`StudyStorage.snapshot()['${key}'].lessons['security-controls'].notes`), 'offline notes');
  offline.backend.offline = false; await offline.run('StudySync.sync()'); assert.equal(offline.backend.row.data[key].lessons['security-controls'].notes, 'offline notes');
  // A concurrent cloud write between select and CAS is retried and merged.
  const race = environment({}, {row: null}); await race.run('StudySync.start()');
  race.context.snapshot = snapshot('racing local'); race.run('StudyStorage.replace(snapshot)');
  race.backend.writeHook = () => {race.backend.row = {revision: 1, data: {'security-decision-lab-v1': {reviewed: ['1.1']}}, updated_at: new Date().toISOString()};};
  await race.run('StudySync.sync()'); assert(race.calls >= 2);
  assert(race.backend.row.data['security-decision-lab-v1'].reviewed.includes('1.1'));
  assert.equal(race.backend.row.data[key].lessons['security-controls'].notes, 'racing local');
  // Local changes during a slow upload survive and remain pending for the next upload.
  race.run(`var s=StudyStorage.snapshot();s['${key}'].lessons['security-controls'].notes='before request';StudyStorage.replace(s)`);
  race.backend.writeHook = () => race.run(`var s=StudyStorage.snapshot();s['${key}'].lessons['security-controls'].notes='typed during request';StudyStorage.replace(s)`);
  await race.run('StudySync.sync()'); assert.equal(race.run(`StudyStorage.snapshot()['${key}'].lessons['security-controls'].notes`), 'typed during request');
  await race.run('StudySync.sync()'); assert.equal(race.backend.row.data[key].lessons['security-controls'].notes, 'typed during request');
  // Progress exports contain only the four study stores, never auth credentials.
  race.saved['security-study-auth-v1'] = 'secret-token'; assert(!JSON.stringify(race.run('StudyStorage.snapshot()')).includes('secret-token'));
  const sql = fs.readFileSync(path.join(root, 'supabase/migrations/202610150001_study_sync.sql'), 'utf8');
  assert(sql.includes('enable row level security')); assert(sql.includes('where user_id = caller and revision = expected_revision'));
  assert(sql.includes('revoke all on public.study_progress from anon, authenticated'));
  console.log('PASS: account isolation, guest preservation, lossless packing, disjoint merges, explicit conflicts, retry boundaries, offline recovery, concurrent-write retries, in-flight typing, token-free exports, and private SQL access contract.');
}
main().catch(error => {console.error(error); process.exitCode = 1;});
