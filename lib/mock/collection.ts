import { delay } from "@/lib/api/delay"

type WithId = { id: string }

const newId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`

/**
 * A tiny localStorage-backed table that behaves like an async DB client.
 * Seeds on first read; falls back to the seed during SSR.
 */
export function createCollection<T extends WithId>(
  name: string,
  seed: T[]
) {
  const key = `votely:db:v2:${name}`

  const read = (): T[] => {
    if (typeof window === "undefined") return seed
    const raw = window.localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
    write(seed)
    return seed
  }

  function write(rows: T[]) {
    window.localStorage.setItem(key, JSON.stringify(rows))
  }

  return {
    async list(): Promise<T[]> {
      await delay()
      return read()
    },

    async get(id: string): Promise<T> {
      await delay()
      const row = read().find((r) => r.id === id)
      if (!row) throw new Error(`${name} not found`)
      return row
    },

    async create(data: Omit<T, "id">): Promise<T> {
      await delay()
      const row = { ...data, id: newId(name) } as T
      write([...read(), row])
      return row
    },

    /** Inserts several rows in one write (one round trip). */
    async createMany(data: Omit<T, "id">[]): Promise<T[]> {
      await delay()
      const rows = data.map((d) => ({ ...d, id: newId(name) }) as T)
      write([...read(), ...rows])
      return rows
    },

    async update(id: string, patch: Partial<Omit<T, "id">>): Promise<T> {
      await delay()
      const rows = read()
      const index = rows.findIndex((r) => r.id === id)
      if (index === -1) throw new Error(`${name} not found`)
      const updated = { ...rows[index], ...patch }
      rows[index] = updated
      write(rows)
      return updated
    },

    async remove(id: string): Promise<string> {
      await delay()
      write(read().filter((r) => r.id !== id))
      return id
    },

    async removeWhere(predicate: (row: T) => boolean): Promise<void> {
      write(read().filter((r) => !predicate(r)))
    },

    /** Synchronous read for joins inside other mock endpoints (no latency). */
    snapshot: read,
  }
}
