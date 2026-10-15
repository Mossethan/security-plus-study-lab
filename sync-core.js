// Pure serialization and three-way merge. Conflicting attempts stay intact for explicit resolution.
const StudySyncCore = (() => {
  const keys = ['security-decision-lab-v1', 'security-messer-v1', 'security-practice-v1', 'security-messer-checkpoints-v1'];
  const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
  function stable(value) {
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    if (object(value)) return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
    return JSON.stringify(value);
  }
  const equal = (a, b) => stable(a) === stable(b);
  function validate(value) {
    if (JSON.stringify(value).length > 2_000_000) throw Error('This backup is too large (maximum 2 MB).');
    let count = 0;
    function walk(item, depth) {
      if (++count > 150000 || depth > 24) throw Error('Invalid progress structure.');
      if (typeof item === 'number' && !Number.isFinite(item)) throw Error('Invalid progress value.');
      if (item && typeof item === 'object') {
        for (const key of Object.keys(item)) {
          if (['__proto__', 'prototype', 'constructor'].includes(key)) throw Error('Invalid progress field.');
          walk(item[key], depth + 1);
        }
      }
    }
    walk(value, 0);
    if (!object(value) || Object.keys(value).some(k => !keys.includes(k)) || Object.values(value).some(v => !object(v))) throw Error('This is not a Study Lab progress backup.');
    const checkMap = (store, fields) => {
      for (const field of fields) if (store?.[field] !== undefined && !object(store[field])) throw Error('Invalid progress field: ' + field);
    };
    const study = value[keys[0]];
    checkMap(study, ['first', 'reviews', 'labs', 'labDrafts']);
    for (const field of ['reviewed', 'weak']) if (study?.[field] !== undefined && (!Array.isArray(study[field]) || !study[field].every(id => typeof id === 'string'))) throw Error('Invalid study list.');
    const messer = value[keys[1]];
    checkMap(messer, ['lessons']);
    for (const lesson of Object.values(messer?.lessons || {})) {
      if (!object(lesson) || lesson.notes !== undefined && typeof lesson.notes !== 'string') throw Error('Invalid lesson notes.');
      checkMap(lesson, ['answers', 'choices', 'matches']);
    }
    const practice = value[keys[2]];
    checkMap(practice, ['seen']);
    if (practice?.history !== undefined && !Array.isArray(practice.history)) throw Error('Invalid quiz history.');
    const checkpoints = value[keys[3]];
    checkMap(checkpoints, ['unlocked', 'sessions', 'seen', 'reviews', 'history']);
    for (const history of Object.values(checkpoints?.history || {})) if (!Array.isArray(history)) throw Error('Invalid checkpoint history.');
    return value;
  }
  function pack(snapshot) {
    validate(snapshot);
    const units = {};
    const put = (path, value) => { if (value !== undefined) units[JSON.stringify(path)] = value; };
    const map = (path, value) => { if (object(value)) for (const [id, item] of Object.entries(value)) put([...path, id], item); };
    const core = snapshot[keys[0]] || {};
    for (const field of ['reviewed', 'weak']) for (const id of core[field] || []) put(['study', field, id], true);
    for (const field of ['first', 'reviews', 'labs', 'labDrafts']) map(['study', field], core[field]);
    if (core.session) put(['study', 'session'], core.session);
    const messer = snapshot[keys[1]] || {};
    for (const [id, lesson] of Object.entries(messer.lessons || {})) {
      if (lesson.notes) put(['messer', id, 'notes'], lesson.notes);
      if (lesson.watched) put(['messer', id, 'watched'], true);
      const {notes, watched, ...attempt} = lesson;
      if (Object.keys(attempt.answers || {}).length || Object.keys(attempt.choices || {}).length || Object.keys(attempt.matches || {}).length || attempt.checked || attempt.best !== null && attempt.best !== undefined) put(['messer', id, 'attempt'], attempt);
    }
    const practice = snapshot[keys[2]] || {};
    for (const mode of ['quiz', 'exam']) if (practice[mode]) put(['practice', mode], practice[mode]);
    map(['practice', 'seen'], practice.seen);
    if (practice.history?.length) put(['practice', 'history'], practice.history);
    const checkpoints = snapshot[keys[3]] || {};
    for (const field of ['unlocked', 'sessions', 'seen', 'reviews']) map(['checkpoints', field], checkpoints[field]);
    for (const [id, history] of Object.entries(checkpoints.history || {})) if (history.length) put(['checkpoints', 'history', id], history);
    return units;
  }
  function unpack(units, local = {}) {
    const core = {reviewed: [], first: {}, weak: [], session: null, lastLesson: local[keys[0]]?.lastLesson || '1.1', reviews: {}, labs: {}, labDrafts: {}};
    const messer = {lessons: {}, last: local[keys[1]]?.last || ''};
    const practice = {quiz: null, exam: null, seen: {}, history: []};
    const checkpoints = {unlocked: {}, sessions: {}, seen: {}, reviews: {}, history: {}};
    for (const [key, value] of Object.entries(units)) {
      const [group, field, id] = JSON.parse(key);
      if (group === 'study') {
        if (['reviewed', 'weak'].includes(field)) { if (value) core[field].push(id); }
        else if (field === 'session') core.session = value;
        else if (Object.hasOwn(core, field) && object(core[field])) core[field][id] = value;
      } else if (group === 'messer') {
        const lesson = messer.lessons[field] ||= {notes: '', watched: false};
        if (id === 'attempt') Object.assign(lesson, value);
        else if (['notes', 'watched'].includes(id)) lesson[id] = value;
      } else if (group === 'practice') {
        if (field === 'seen') practice.seen[id] = value;
        else if (['quiz', 'exam', 'history'].includes(field)) practice[field] = value;
      } else if (group === 'checkpoints' && Object.hasOwn(checkpoints, field)) checkpoints[field][id] = value;
    }
    return validate(Object.fromEntries(keys.map((key, i) => [key, [core, messer, practice, checkpoints][i]])));
  }
  function merge(base, local, remote, choices = {}) {
    const result = {}, conflicts = [];
    for (const key of new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])) {
      const b = base[key], l = local[key], r = remote[key];
      let value;
      if (equal(l, r) || equal(r, b)) value = l;
      else if (equal(l, b)) value = r;
      else {
        const path = JSON.parse(key);
        if (path.includes('seen') && [b ?? 0, l ?? 0, r ?? 0].every(Number.isFinite)) value = Math.max(l || 0, r || 0);
        else if (path.includes('history') && Array.isArray(l) && Array.isArray(r)) {
          value = [...new Map([...r, ...l].map(item => [JSON.stringify([item.mode, item.finished]), item])).values()].sort((a, b) => b.finished - a.finished).slice(0, 10);
        } else if (choices[key] === 'device') value = l;
        else if (choices[key] === 'cloud') value = r;
        else { conflicts.push({key, path, local: l, remote: r}); value = l; }
      }
      if (value !== undefined) result[key] = value;
    }
    return {units: result, conflicts};
  }
  return {keys, pack, unpack, merge, validate, equal, stable};
})();
