import type { ReactNode } from 'react'
import { TabBar } from './components/TabBar'
import { useRoute } from './lib/router'
import { History } from './screens/History'
import { Program } from './screens/Program'
import { Settings } from './screens/Settings'
import { Tips } from './screens/Tips'
import { Today } from './screens/Today'
import styles from './App.module.css'

function screenFor(route: string): ReactNode {
  switch (route) {
    case '/programme':
      return <Program />
    case '/suivi':
      return <History />
    case '/conseils':
      return <Tips />
    case '/reglages':
      return <Settings />
    default:
      return <Today />
  }
}

export function App() {
  const route = useRoute()

  // The tab bar comes after the content so keyboard and screen reader users reach the screen first.
  return (
    <>
      <main className={styles.main}>{screenFor(route)}</main>
      <TabBar route={route} />
    </>
  )
}
