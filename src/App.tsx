import type { ReactNode } from 'react'
import { TabBar } from './components/TabBar'
import { useRoute } from './lib/router'
import { History } from './screens/History'
import { Intervals } from './screens/Intervals'
import { LongWalk } from './screens/LongWalk'
import { Program } from './screens/Program'
import { Routine } from './screens/Routine'
import { Run } from './screens/Run'
import { Settings } from './screens/Settings'
import { Tips } from './screens/Tips'
import { Today } from './screens/Today'
import { Workout } from './screens/Workout'
import styles from './App.module.css'

/** Session screens take the whole screen, without the tab bar. */
function sessionFor(route: string): ReactNode | null {
  switch (route) {
    case '/seance/A':
      return <Workout key="A" sessionId="A" />
    case '/seance/B':
      return <Workout key="B" sessionId="B" />
    case '/course':
      return <Run />
    case '/fractionne':
      return <Intervals />
    case '/marche':
      return <LongWalk />
    case '/routine/posture':
      return <Routine key="posture" kind="posture" />
    case '/routine/etirements':
      return <Routine key="etirements" kind="etirements" />
    default:
      return null
  }
}

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
  const session = sessionFor(route)
  if (session) return <main>{session}</main>

  // The tab bar comes after the content so keyboard and screen reader users reach the screen first.
  return (
    <>
      <main className={styles.main}>{screenFor(route)}</main>
      <TabBar route={route} />
    </>
  )
}
