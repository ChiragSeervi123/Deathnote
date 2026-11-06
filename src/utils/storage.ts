/**
 * localStorage that never throws (private mode, blocked storage, sandboxed
 * previews). Used only for per-visitor conveniences.
 */
export const safeStorage: Storage = {
  get length() {
    try {
      return window.localStorage.length;
    } catch {
      return 0;
    }
  },
  clear() {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  },
  getItem(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  key(index: number) {
    try {
      return window.localStorage.key(index);
    } catch {
      return null;
    }
  },
  removeItem(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  setItem(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};
