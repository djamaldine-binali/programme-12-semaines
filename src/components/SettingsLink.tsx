import { Settings } from 'lucide-react'
import styles from './SettingsLink.module.css'

export function SettingsLink() {
  return (
    <a href="#/reglages" className={styles.link} aria-label="Réglages">
      <Settings size={24} aria-hidden="true" />
    </a>
  )
}
