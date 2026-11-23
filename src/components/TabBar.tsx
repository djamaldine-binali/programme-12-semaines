import { BookOpen, CalendarRange, ListChecks, Sun, type LucideIcon } from 'lucide-react'
import styles from './TabBar.module.css'

interface Tab {
  label: string
  icon: LucideIcon
  /** The first path is the tab target, the others are screens that belong to it. */
  paths: string[]
}

const tabs: Tab[] = [
  { label: "Aujourd'hui", icon: Sun, paths: ['/', '/reglages'] },
  { label: 'Programme', icon: CalendarRange, paths: ['/programme', '/bibliotheque'] },
  { label: 'Suivi', icon: ListChecks, paths: ['/suivi'] },
  { label: 'Conseils', icon: BookOpen, paths: ['/conseils', '/repas'] },
]

function isActive(tab: Tab, route: string): boolean {
  return tab.paths.some((path) => route === path || route.startsWith(`${path}/`))
}

export function TabBar({ route }: { route: string }) {
  return (
    <nav className={styles.bar} aria-label="Navigation principale">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(tab, route)
        return (
          <a
            key={tab.label}
            href={`#${tab.paths[0]}`}
            className={styles.tab}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={24} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
            <span>{tab.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
