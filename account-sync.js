const StudySync = (() => {
  const C = StudySyncCore, S = StudyStorage;
  let client = null, user = null, running = false, applying = false, timer = null;
  let status = 'Saved on this device', message = '', conflicts = null, lastSync = null;
  let signedOut = false, authReady = false;
  const configured = () => /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(window.STUDY_SYNC_CONFIG?.url || '') && !!window.STUDY_SYNC_CONFIG?.publishableKey;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isAccount = () => /\/account(?:\.html)?\/?$/.test(location.pathname);
  const current = () => C.pack(S.snapshot());
  function updateStatus(next, detail = '') {
    status = next; message = detail;
    const badge = document.getElementById('account-status');
    if (badge) { badge.textContent = next; badge.title = detail || next; }
    const note = document.getElementById('account-message');
    if (note) note.textContent = detail || (lastSync ? 'Last synced ' + new Date(lastSync).toLocaleString() : '');
    const title = document.getElementById('account-sync-state');
    if (title) title.textContent = next;
    const footer = document.getElementById('progress-location');
    if (footer) footer.textContent = S.owner === 'guest' ? 'Progress is saved in this browser. Sign in to sync between devices.' : 'Progress is saved on this device and syncs to your account when connected.';
  }
  function reloadApp() {
    const active = document.activeElement, id = active?.id;
    const selection = active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null;
    const scroll = [window.scrollX, window.scrollY];
    applying = true;
    try { window.StudyApp?.reload(); } finally { applying = false; }
    const restored = id && document.getElementById(id);
    if (restored) { restored.focus({preventScroll: true}); if (selection && restored.setSelectionRange) restored.setSelectionRange(...selection); }
    window.scrollTo(...scroll);
  }
  function cache() { return S.meta('base') || {units: {}, revision: 0}; }
  function backup(snapshot, label) {
    const old = S.meta('backups') || [];
    S.meta('backups', [{at: new Date().toISOString(), label, data: snapshot}, ...old].slice(0, 3));
  }
  function applyUnits(units) {
    if (C.equal(current(), units)) return;
    S.replace(C.unpack(units, S.snapshot())); reloadApp();
  }
  async function sync(resolution) {
    if (!client || !user || running || signedOut || S.owner !== user.id) return;
    running = true; clearTimeout(timer); updateStatus('Syncing…');
    const account = user.id;
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const base = cache(), local = current();
        const {data, error} = await client.from('study_progress').select('revision,data,updated_at').eq('user_id', account).maybeSingle();
        if (error) throw error;
        if (signedOut || S.owner !== account || user?.id !== account) return;
        const remote = C.pack(C.validate(data?.data || {})), revision = data?.revision || 0;
        const choices = resolution && resolution.revision === revision && C.equal(resolution.local, local) ? resolution.choices : {};
        const merged = C.merge(base.units, local, remote, choices);
        if (merged.conflicts.length) {
          conflicts = {...merged, local, remote, revision};
          updateStatus('Review sync conflicts', 'Both devices changed the same notes or attempt. Choose which version to keep in Account & sync.');
          if (isAccount()) renderAccount();
          return;
        }
        const snapshot = C.unpack(merged.units, S.snapshot());
        if (resolution) {
          backup(C.unpack(remote), 'Cloud version before resolving a conflict');
          backup(S.snapshot(), 'Device version before resolving a conflict');
        }
        let savedRevision = revision, savedAt = data?.updated_at;
        if (!C.equal(merged.units, remote)) {
          const saved = await client.rpc('save_study_progress', {expected_revision: revision, progress: snapshot});
          if (saved.error) throw saved.error;
          if (signedOut || S.owner !== account || user?.id !== account) return;
          if (saved.data?.conflict) { resolution = null; continue; }
          if (!Number.isSafeInteger(saved.data?.revision)) throw Error('Invalid sync response.');
          savedRevision = saved.data.revision; savedAt = saved.data.updated_at;
        }
        // Edits made while the request was in flight stay newer than that request.
        const latest = current(), keepLatest = Object.fromEntries(Object.keys(latest).map(key => [key, 'device']));
        for (const key of Object.keys(local)) if (!Object.hasOwn(latest, key)) keepLatest[key] = 'device';
        const combined = C.merge(local, latest, merged.units, keepLatest);
        // Commit local data before the baseline: a storage failure must not acknowledge an unapplied pull.
        applyUnits(combined.units);
        S.meta('base', {units: merged.units, revision: savedRevision});
        lastSync = savedAt || new Date().toISOString(); S.meta('lastSync', lastSync); conflicts = null;
        if (!C.equal(combined.units, merged.units)) { updateStatus('Changes waiting to sync'); schedule(500); }
        else updateStatus('Synced');
        if (isAccount()) renderAccount();
        return;
      }
      throw Error('Another device is updating this account. Try Sync now again.');
    } catch (error) {
      updateStatus('Saved locally · sync pending', navigator.onLine === false ? 'You are offline. Your changes will sync when you reconnect.' : 'Could not reach your account. Your work is still saved locally. Try Sync now; the free database may need to be resumed if inactive.');
      if (isAccount()) renderAccount();
    } finally { running = false; }
  }
  function schedule(delay = 1200) {
    if (!user || applying || signedOut) return;
    clearTimeout(timer); timer = setTimeout(() => sync(), delay);
  }
  async function login() {
    if (!client) return;
    try {
      updateStatus('Opening Google sign-in…');
      const {error} = await client.auth.signInWithOAuth({provider: 'google', options: {redirectTo: new URL('account.html', location.href).href.split('?')[0].split('#')[0], queryParams: {prompt: 'select_account'}}});
      if (error) throw error;
    } catch { updateStatus('Sign-in unavailable', 'Google sign-in could not start. Your device progress is unchanged.'); renderAccount(); }
  }
  async function logout() {
    if (!client || !user || running) return;
    await sync();
    const pending = !C.equal(current(), cache().units) || !!conflicts;
    if (pending && !window.confirm('Some changes have not synced. They will remain in this account’s local workspace on this device. Sign out anyway?')) return;
    signedOut = true; clearTimeout(timer);
    try {
      const {error} = await client.auth.signOut({scope: 'local'});
      if (error) throw error;
      S.switchOwner('guest'); location.replace('account.html');
    } catch { signedOut = false; updateStatus('Could not sign out', 'Reconnect and try again.'); renderAccount(); }
  }
  function download(data, suffix = 'progress') {
    const blob = new Blob([JSON.stringify({format: 'security-study-backup', version: 1, exportedAt: new Date().toISOString(), data}, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `security-plus-${suffix}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function importSnapshot(snapshot, label) {
    C.validate(snapshot);
    const existing = current(), incoming = C.pack(snapshot), merged = C.merge({}, existing, incoming);
    if (merged.conflicts.length) throw Error('Some imported notes or attempts overlap your current progress. Export both workspaces first, then use “Replace from backup” if you want the imported version.');
    backup(S.snapshot(), label); applyUnits(merged.units); schedule(0);
  }
  async function importFile(file, replace = false) {
    if (!file || file.size > 2_000_000) throw Error('Choose a Study Lab JSON backup smaller than 2 MB.');
    const parsed = JSON.parse(await file.text());
    if (parsed.format !== 'security-study-backup' || parsed.version !== 1) throw Error('Choose a Study Lab progress backup.');
    const data = C.validate(parsed.data); C.pack(data);
    if (replace) {
      if (!window.confirm('Replace progress in the current workspace with this backup? When signed in, the replacement will sync to your account. A local recovery copy will be kept.')) return;
      backup(S.snapshot(), 'Before restoring a backup'); applyUnits(C.pack(data)); schedule(0);
    } else importSnapshot(data, 'Before importing a backup');
    updateStatus(user ? 'Changes waiting to sync' : 'Saved on this device', 'Backup imported.'); renderAccount();
  }
  function labelConflict(item) {
    const [group, field, id] = item.path;
    if (group === 'messer') {
      const lesson = typeof MESSER_LESSONS !== 'undefined' && MESSER_LESSONS.find(l => l.id === field);
      return 'Messer: ' + (lesson?.title || field) + ' · ' + (id === 'attempt' ? 'lesson answers and matching' : id);
    }
    return ({study: 'Study path', practice: 'Practice', checkpoints: 'Cumulative checkpoints'}[group] || group) + ' · ' + field + (id ? ' · ' + id : '');
  }
  function preview(value) {
    if (value === undefined) return 'Removed / cleared';
    if (typeof value === 'string') return value.slice(0, 300);
    if (value && typeof value === 'object') {
      if (value.answers) return Object.keys(value.answers).length + ' answers · ' + (value.finished ? 'submitted' : 'in progress');
      return JSON.stringify(value).slice(0, 300);
    }
    return String(value);
  }
  function renderAccount() {
    const root = document.getElementById('main'); if (!root) return;
    let hasGuest = false, backups = [];
    try { hasGuest = Object.keys(C.pack(S.snapshot('guest'))).length > 0; backups = S.meta('backups') || []; } catch {}
    const cached = S.owner !== 'guest';
    root.innerHTML = `<div class="eyebrow">Your study workspace</div><h1>Account & sync</h1><p class="intro">Keep your answers, Messer notes, weak spots and practice attempts together across devices.</p>
      <div class="columns"><div><section class="card"><span class="eyebrow">${cached ? 'ACCOUNT WORKSPACE' : 'DEVICE WORKSPACE'}</span><h2 class="spacer">${user ? escape(user.email || 'Signed in') : cached ? 'Saved account progress' : 'Study anywhere'}</h2>
      ${user ? '<p>Your progress is private to this account. Your friend can sign in separately and keep their own answers.</p><div class="row"><button id="sync-now" class="primary">Sync now</button><button id="sign-out">Sign out on this device</button></div>' : configured() ? `<p>${cached ? 'Sign in again to reconnect this device’s saved account workspace.' : 'Sign in with Google to save your progress to an account. You can also keep studying without signing in.'}</p><button id="sign-in" class="primary" ${authReady ? '' : 'disabled'}>Continue with Google</button>` : '<p>Account sync is being set up. You can keep studying and export a backup below. Your existing answers and notes are saved on this device.</p>'}
      <p class="sync-indicator" id="account-sync-state" role="status">${escape(status)}</p><p class="small muted" id="account-message">${escape(message || (lastSync ? 'Last synced ' + new Date(lastSync).toLocaleString() : ''))}</p></section>
      ${user && hasGuest ? '<section class="card"><h2>Bring your previous progress</h2><p>This browser has progress from before you signed in. Import it into this account. The original device copy is kept.</p><div class="row"><button id="import-guest">Import previous browser progress</button><button id="export-guest">Export previous browser progress</button></div><p id="guest-import-result" role="status"></p></section>' : ''}
      ${conflicts ? `<section class="card sync-conflicts"><h2>Choose which changes to keep</h2><p>These items changed on both this device and another device. Other progress will merge automatically. Export a backup before choosing if you want a separate copy of this device’s version.</p><form id="conflict-form">${conflicts.conflicts.map((item, i) => `<fieldset><legend>${escape(labelConflict(item))}</legend><label><input type="radio" name="conflict-${i}" value="device" required> Keep this device</label><p class="small sync-preview">${escape(preview(item.local))}</p><label><input type="radio" name="conflict-${i}" value="cloud" required> Keep the cloud version</label><p class="small sync-preview">${escape(preview(item.remote))}</p></fieldset>`).join('')}<button class="primary">Save choices and sync</button></form></section>` : ''}
      </div><div><section class="card"><h2>Back up your progress</h2><p>Download a portable copy of this workspace’s notes, answers and saved attempts. Login tokens are never included.</p><button id="export-progress">Export progress</button><label class="spacer sync-file">Restore a Study Lab backup<input id="import-progress" type="file" accept="application/json,.json"></label><label class="small"><input id="replace-backup" type="checkbox"> Replace from backup instead of merging</label><p class="small muted">Restores affect your current workspace. Account changes sync when connected.</p><p id="import-result" role="status"></p>${backups.length ? '<h3 class="spacer">Local recovery copies</h3>' + backups.map((item, i) => `<button class="sync-recovery" data-recovery="${i}">Download: ${escape(item.label)} · ${escape(new Date(item.at).toLocaleDateString())}</button>`).join('') : ''}</section>
      <section class="card"><h3>What gets saved?</h3><p class="small muted">Study-path reviews and labs; Messer watched status, notes and lesson answers; quiz and exam attempts; cumulative checkpoints and weak spots.</p><p class="small muted">Offline changes stay on this device until you reconnect. An exam’s 90-minute deadline keeps running when you leave or switch devices.</p><p class="small muted">Signing out returns to this browser’s separate guest workspace. Cached account progress stays on this device for offline use.</p></section></div></div>`;
    const bind = (id, action) => { const el = document.getElementById(id); if (el) el.onclick = action; };
    bind('sign-in', login); bind('sign-out', logout); bind('sync-now', () => sync());
    bind('export-progress', () => download(S.snapshot()));
    bind('export-guest', () => download(S.snapshot('guest'), 'previous-browser-progress'));
    bind('import-guest', () => {
      try { importSnapshot(S.snapshot('guest'), 'Before importing browser progress'); renderAccount(); const el = document.getElementById('guest-import-result'); if (el) el.textContent = 'Browser progress imported. The original copy is kept.'; }
      catch (error) { document.getElementById('guest-import-result').textContent = error.message; }
    });
    const upload = document.getElementById('import-progress');
    if (upload) upload.onchange = async () => { try { await importFile(upload.files[0], document.getElementById('replace-backup').checked); } catch (error) { document.getElementById('import-result').textContent = error.message || 'Could not read this backup.'; } };
    root.querySelectorAll('[data-recovery]').forEach(el => el.onclick = () => download(backups[Number(el.dataset.recovery)].data, 'recovery'));
    const form = document.getElementById('conflict-form');
    if (form) form.onsubmit = event => {
      event.preventDefault(); if (!form.reportValidity()) return;
      const fields = new FormData(form), choices = {};
      conflicts.conflicts.forEach((item, i) => choices[item.key] = fields.get('conflict-' + i));
      sync({revision: conflicts.revision, local: conflicts.local, choices});
    };
    updateStatus(status, message);
  }
  async function acceptSession(session) {
    user = session?.user || null;
    if (user && S.owner !== user.id) { S.switchOwner(user.id); lastSync = S.meta('lastSync'); reloadApp(); }
    if (user) { signedOut = false; await sync(); }
    else updateStatus(S.owner === 'guest' ? 'Saved on this device' : 'Sign in to sync');
    if (isAccount()) renderAccount();
  }
  async function start() {
    updateStatus(status);
    window.addEventListener('study-save', () => { if (applying) return; if (user) { conflicts = null; updateStatus('Changes waiting to sync'); schedule(); } });
    window.addEventListener('online', () => schedule(0));
    window.addEventListener('offline', () => { if (user) updateStatus('Saved locally · offline'); });
    window.addEventListener('focus', () => schedule(0));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(0); });
    window.addEventListener('storage', event => { if (S.logicalKey(event.key)) { reloadApp(); schedule(); } });
    if (!configured()) { authReady = true; if (isAccount()) renderAccount(); return; }
    try {
      if (!window.supabase?.createClient) throw Error('Sign-in library unavailable.');
      client = window.supabase.createClient(window.STUDY_SYNC_CONFIG.url, window.STUDY_SYNC_CONFIG.publishableKey, {auth: {flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: 'security-study-auth-v1'}});
      const {data, error} = await client.auth.getSession(); if (error) throw error;
      authReady = true;
      await acceptSession(data.session);
      client.auth.onAuthStateChange((event, session) => {
        // Run outside the auth callback to avoid Supabase's session lock deadlock.
        setTimeout(() => { if (event === 'SIGNED_OUT' && user && !signedOut) { user = null; updateStatus('Sign in to sync'); if (isAccount()) renderAccount(); } else if (session) acceptSession(session); }, 0);
      });
      setInterval(() => { if (!document.hidden && !conflicts) sync(); }, 30000);
    } catch { authReady = true; updateStatus('Account sync unavailable', 'Your progress is still saved locally. Reload when connected to try again.'); if (isAccount()) renderAccount(); }
  }
  return {start, renderAccount, sync};
})();
