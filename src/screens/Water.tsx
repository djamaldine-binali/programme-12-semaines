import { BellOff, BellRing, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import buttons from '../components/buttons.module.css'
import { WaterTracker } from '../components/WaterTracker'
import { currentSubscription, disableReminders, enableReminders, pushSupport, REMINDER_HOURS } from '../lib/push'
import { useNow } from '../lib/useNow'
import { useToday } from '../lib/useToday'
import { useWater } from '../lib/useWater'
import { formatLitres, GOAL_OPTIONS_ML } from '../lib/water'
import { ChoiceGroup } from './ChoiceGroup'
import styles from './Water.module.css'

function Reminders() {
  const support = pushSupport()
  const [subscribed, setSubscribed] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void currentSubscription().then((subscription) => setSubscribed(subscription !== null))
  }, [])

  async function toggle() {
    setBusy(true)
    setError('')
    try {
      if (subscribed) await disableReminders()
      else await enableReminders()
      setSubscribed(!subscribed)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Les rappels ne répondent pas, réessaie plus tard.')
    } finally {
      setBusy(false)
    }
  }

  const hours = REMINDER_HOURS.map((hour) => `${hour} h`).join(', ')

  return (
    <section aria-labelledby="reminders-title" className="card">
      <h2 id="reminders-title">Rappels</h2>
      <p className={styles.muted}>
        Une notification à {hours}. Elle te dit où tu en es et combien boire. Sur Android, tu peux répondre directement
        dans la notification&nbsp;; sur iPhone, touche-la pour répondre dans l'app.
      </p>
      {support === 'unconfigured' && <p>Les rappels arrivent bientôt dans l'app.</p>}
      {support === 'unsupported' && <p>Ce navigateur ne reçoit pas de notifications.</p>}
      {support === 'needs-install' && (
        <p>
          Sur iPhone, les rappels ne marchent qu'avec l'app sur l'écran d'accueil&nbsp;: dans Safari, touche Partager,
          puis «&nbsp;Sur l'écran d'accueil&nbsp;», et ouvre Amélia depuis son icône.
        </p>
      )}
      {support === 'ready' && subscribed !== null && (
        <button
          type="button"
          className={`${buttons.button} ${subscribed ? buttons.secondary : buttons.primary}`}
          disabled={busy}
          onClick={() => void toggle()}
        >
          {subscribed ? <BellOff size={20} aria-hidden="true" /> : <BellRing size={20} aria-hidden="true" />}
          {subscribed ? 'Couper les rappels' : 'Activer les rappels'}
        </button>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export function Water() {
  const today = useToday()
  const now = useNow()
  const water = useWater(today)

  return (
    <div className={styles.page}>
      <a href="#/" className={styles.back}>
        <ChevronLeft size={20} aria-hidden="true" />
        Aujourd'hui
      </a>
      <h1>Eau</h1>

      <section aria-label="Eau bue aujourd'hui" className="card">
        {water.ready && <WaterTracker water={water} now={now} />}
      </section>

      <Reminders />

      <section aria-labelledby="goal-title" className="card">
        <h2 id="goal-title">Objectif du jour</h2>
        {water.ready && (
          <ChoiceGroup
            legend="Litres par jour"
            options={GOAL_OPTIONS_ML.map((ml) => ({ value: ml, label: formatLitres(ml) }))}
            value={water.goalMl}
            onChange={water.setGoal}
          />
        )}
        <p className={styles.muted}>
          Les repères européens donnent environ 2&nbsp;L d'eau par jour pour une femme, en comptant ce qu'apportent les
          repas. Les jours de séance ou de chaleur, bois un peu plus.
        </p>
      </section>
    </div>
  )
}
