import { GlassWater } from 'lucide-react'
import buttons from '../components/buttons.module.css'
import { OtterMark } from '../components/OtterMark'
import { navigate } from '../lib/router'
import { useToday } from '../lib/useToday'
import { useWater } from '../lib/useWater'
import { formatCentilitres, formatLitres } from '../lib/water'
import styles from './Water.module.css'

/** Opened from a reminder on iPhone, where notifications have no buttons. */
export function WaterReminder({ sipMl }: { sipMl: number }) {
  const today = useToday()
  const water = useWater(today)

  function log() {
    water.drink(sipMl)
    navigate('/', { replace: true })
  }

  return (
    <div className={`${styles.page} ${styles.reminder}`}>
      <OtterMark size={112} />
      <h1>Bois {formatCentilitres(sipMl)} d'eau</h1>
      {water.ready && (
        <p className={styles.muted}>
          Tu es à {formatLitres(water.totalMl)} sur {formatLitres(water.goalMl)} aujourd'hui.
        </p>
      )}
      <div className={styles.reminderActions}>
        <button type="button" className={`${buttons.button} ${buttons.primary} ${buttons.block}`} onClick={log}>
          <GlassWater size={20} aria-hidden="true" />
          Je bois maintenant
        </button>
        <button type="button" className={`${buttons.button} ${buttons.secondary} ${buttons.block}`} onClick={log}>
          C'est déjà fait
        </button>
        <a href="#/" className={styles.later}>
          Plus tard
        </a>
      </div>
    </div>
  )
}
