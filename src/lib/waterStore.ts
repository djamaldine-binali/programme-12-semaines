import { DEFAULT_GOAL_ML } from './water'
import type { DayKey } from './schedule'

// Water lives in IndexedDB, not in the localStorage state: the service worker has to read it to word a
// reminder and to log a glass from the notification. public/push-sw.js opens the same database.
const DB_NAME = 'amelia'
const DB_VERSION = 1
export const WATER_CHANNEL = 'amelia-water'

export interface WaterIntake {
  id?: number
  day: DayKey
  ml: number
  at: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore('water', { keyPath: 'id', autoIncrement: true }).createIndex('day', 'day')
      db.createObjectStore('settings')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function run<T>(store: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = action(db.transaction(store, mode).objectStore(store))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }),
  )
}

function announceChange() {
  const channel = new BroadcastChannel(WATER_CHANNEL)
  channel.postMessage('changed')
  channel.close()
}

export function intakesOf(day: DayKey): Promise<WaterIntake[]> {
  return run('water', 'readonly', (store) => store.index('day').getAll(day))
}

export async function addIntake(day: DayKey, ml: number): Promise<void> {
  await run('water', 'readwrite', (store) => store.add({ day, ml, at: new Date().toISOString() }))
  announceChange()
}

export async function removeIntake(id: number): Promise<void> {
  await run('water', 'readwrite', (store) => store.delete(id))
  announceChange()
}

export async function readGoalMl(): Promise<number> {
  const saved = await run<unknown>('settings', 'readonly', (store) => store.get('waterGoalMl'))
  return typeof saved === 'number' ? saved : DEFAULT_GOAL_ML
}

export async function saveGoalMl(ml: number): Promise<void> {
  await run('settings', 'readwrite', (store) => store.put(ml, 'waterGoalMl'))
  announceChange()
}
