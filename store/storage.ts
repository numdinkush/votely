import type { WebStorage } from "redux-persist"

const noopStorage: WebStorage = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
}

/** localStorage in the browser, no-op during SSR (avoids redux-persist warning). */
export const storage: WebStorage =
  typeof window === "undefined"
    ? noopStorage
    : {
        getItem: async (key) => window.localStorage.getItem(key),
        setItem: async (key, value) => window.localStorage.setItem(key, value),
        removeItem: async (key) => window.localStorage.removeItem(key),
      }
