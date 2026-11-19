import { ChevronDown, ChevronRight } from 'lucide-react'
import { activityInfo } from '../lib/activities'
import { isDeloadWeek, type Activity } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import styles from './Today.module.css'

export function OtherSessions({ week }: { week: number }) {
  const { state } = useAppState()
  const activities: Activity[] = [
    'renfo_A',
    'renfo_B',
    'course',
    isDeloadWeek(week) ? 'marche_longue' : 'fractionne',
    'posture_ou_repos',
  ]
  const links = [
    ...activities.map((activity) => {
      const info = activityInfo(activity, week, state.runShift)
      const title = activity === 'posture_ou_repos' ? 'Routine posture' : info.title
      return { title, path: info.path }
    }),
    { title: 'Étirements', path: '/routine/etirements' },
  ]

  return (
    <details className={styles.other}>
      <summary>
        Faire une autre séance
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
      <p className={styles.hint}>Pratique si tu as décalé un jour.</p>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <li key={link.path + link.title}>
            <a href={`#${link.path}`}>
              {link.title}
              <ChevronRight size={20} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
