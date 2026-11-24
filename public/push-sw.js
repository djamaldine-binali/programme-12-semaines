/* Water reminders, loaded into the service worker by Workbox (see vite.config.ts).
   Reads the same IndexedDB as src/lib/waterStore.ts, and words the reminder like src/lib/water.ts. */

const GLASS_ML = 250
const BOTTLE_ML = 500
const DEFAULT_GOAL_ML = 2000

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('amelia', 1)
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore('water', { keyPath: 'id', autoIncrement: true }).createIndex('day', 'day')
      db.createObjectStore('settings')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run(store, mode, action) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(store, mode).objectStore(store))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function dayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function litres(ml) {
  return `${(Math.round(ml / 10) / 100).toLocaleString('fr-FR')} L`
}

async function waterToday(now) {
  const [intakes, goal] = await Promise.all([
    run('water', 'readonly', (store) => store.index('day').getAll(dayKey(now))),
    run('settings', 'readonly', (store) => store.get('waterGoalMl')),
  ])
  const goalMl = typeof goal === 'number' ? goal : DEFAULT_GOAL_ML
  const totalMl = intakes.reduce((total, intake) => total + intake.ml, 0)
  const hours = now.getHours() + now.getMinutes() / 60
  const share = Math.min(1, Math.max(0, (hours - 8) / 13))
  const expected = Math.round((goalMl * share) / 50) * 50
  const missing = expected - totalMl
  const sip = missing > 0 ? Math.min(BOTTLE_ML, Math.max(GLASS_ML, Math.ceil(missing / 50) * 50)) : GLASS_ML
  return { goalMl, totalMl, expected, behind: missing > 0, sip }
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      const water = await waterToday(new Date())
      const cl = water.sip / 10
      const body = water.behind
        ? `Tu es à ${litres(water.totalMl)}, vise ${litres(water.expected)} à cette heure : bois ${cl} cl.`
        : `Tu es à ${litres(water.totalMl)} sur ${litres(water.goalMl)}, tu es dans les temps. Un verre de plus ?`
      await self.registration.showNotification(water.behind ? `Bois ${cl} cl d'eau` : "Petit point sur l'eau", {
        body,
        icon: 'pwa-192.png',
        tag: 'water',
        data: { sip: water.sip },
        actions: [
          { action: 'drink', title: `Je bois ${cl} cl` },
          { action: 'already', title: 'Déjà bu' },
        ],
      })
    })(),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const sip = event.notification.data?.sip ?? GLASS_ML
  event.waitUntil(
    (async () => {
      // Android shows the buttons: log the water without opening the app.
      if (event.action === 'drink' || event.action === 'already') {
        await run('water', 'readwrite', (store) => store.add({ day: dayKey(new Date()), ml: sip, at: new Date().toISOString() }))
        const channel = new BroadcastChannel('amelia-water')
        channel.postMessage('changed')
        channel.close()
        return
      }
      // iPhone has no buttons: open the reminder screen of the app.
      const url = new URL(`./#/eau/rappel/${sip}`, self.registration.scope).href
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const open = windows.find((client) => client.url.startsWith(self.registration.scope))
      if (open) {
        await open.navigate(url)
        return open.focus()
      }
      return self.clients.openWindow(url)
    })(),
  )
})
