import { SettingsLink } from './SettingsLink'
import { OtterMark } from './OtterMark'
import styles from './BrandBar.module.css'

export function BrandBar() {
  return (
    <header className={styles.bar}>
      <a href="#/" className={styles.brand}>
        <OtterMark size={36} />
        <span>Amélia</span>
      </a>
      <SettingsLink />
    </header>
  )
}
