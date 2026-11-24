import { useEffect, type ReactNode } from 'react'
import { BrandBar } from './components/BrandBar'
import { TabBar } from './components/TabBar'
import { useRoute } from './lib/router'
import { History } from './screens/History'
import { ExerciseSheet } from './screens/ExerciseSheet'
import { Intervals } from './screens/Intervals'
import { Library } from './screens/Library'
import { LongWalk } from './screens/LongWalk'
import { Meals } from './screens/Meals'
import { Program } from './screens/Program'
import { Recipe } from './screens/Recipe'
import { Routine } from './screens/Routine'
import { Run } from './screens/Run'
import { Settings } from './screens/Settings'
import { Pantry, Shopping } from './screens/Shopping'
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
  const sheet = route.match(/^\/bibliotheque\/([\w-]+)$/)
  if (sheet) return <ExerciseSheet key={sheet[1]} id={sheet[1]} />
  const recipe = route.match(/^\/repas\/recette\/([\w-]+)$/)
  if (recipe) return <Recipe key={recipe[1]} id={recipe[1]} />
  switch (route) {
    case '/bibliotheque':
      return <Library />
    case '/programme':
      return <Program />
    case '/suivi':
      return <History />
    case '/conseils':
      return <Tips />
    case '/repas':
      return <Meals />
    case '/repas/courses':
      return <Shopping />
    case '/repas/placard':
      return <Pantry />
    case '/reglages':
      return <Settings />
    default:
      return <Today />
  }
}

export function App() {
  const route = useRoute()

  // Each new screen announces itself: focus its title, like a page load would.
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1')
    if (!heading) return
    heading.tabIndex = -1
    heading.focus()
  }, [route])
  const session = sessionFor(route)
  if (session) return <main>{session}</main>

  // The tab bar comes after the content so keyboard and screen reader users reach the screen first.
  return (
    <>
      <main className={styles.main}>
        <BrandBar />
        {screenFor(route)}
      </main>
      <TabBar route={route} />
    </>
  )
}
