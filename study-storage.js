// A separate local workspace for each account. Original keys remain the guest workspace.
const StudyStorage = (() => {
  const keys = ['security-decision-lab-v1', 'security-messer-v1', 'security-practice-v1', 'security-messer-checkpoints-v1'];
  const scopeKey = 'security-study-owner-v1';
  let owner = 'guest';
  try { const saved = localStorage.getItem(scopeKey); if (/^[a-f0-9-]{36}$/.test(saved || '')) owner = saved; } catch {}
  const physical = (key, scope = owner) => scope === 'guest' ? key : `security-study-user:${scope}:${key}`;
  const read = (key, scope = owner) => localStorage.getItem(physical(key, scope));
  return {
    keys,
    get owner() { return owner; },
    getItem: read,
    setItem(key, value) {
      const target = physical(key), changed = localStorage.getItem(target) !== value;
      localStorage.setItem(target, value);
      if (changed) window.dispatchEvent(new CustomEvent('study-save', {detail: {key}}));
    },
    logicalKey(key) { return keys.find(k => physical(k) === key) || null; },
    switchOwner(next) {
      if (next !== 'guest' && !/^[a-f0-9-]{36}$/.test(next)) throw Error('Invalid account.');
      localStorage.setItem(scopeKey, next); owner = next;
    },
    snapshot(scope = owner) {
      const result = {};
      for (const key of keys) { const raw = read(key, scope); if (raw) result[key] = JSON.parse(raw); }
      return result;
    },
    replace(snapshot) {
      // Keep a rollback copy if quota/storage errors interrupt a multi-key update.
      const before = keys.map(key => [physical(key), localStorage.getItem(physical(key))]);
      try {
        for (const key of keys) {
          const target = physical(key);
          if (Object.hasOwn(snapshot, key)) localStorage.setItem(target, JSON.stringify(snapshot[key]));
          else localStorage.removeItem(target);
        }
      } catch (error) {
        for (const [key, raw] of before) { try { if (raw === null) localStorage.removeItem(key); else localStorage.setItem(key, raw); } catch {} }
        throw error;
      }
    },
    meta(key, value) {
      const target = `security-study-sync:${owner}:${key}`;
      if (arguments.length === 2) localStorage.setItem(target, JSON.stringify(value));
      else { const raw = localStorage.getItem(target); return raw ? JSON.parse(raw) : null; }
    },
    scopeKey
  };
})();

window.addEventListener('storage', event => {
  if (event.key === StudyStorage.scopeKey) location.reload();
});
