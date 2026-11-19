import { GuidedSession } from '../components/GuidedSession'
import styles from '../components/GuidedSession.module.css'
import { program } from '../data/program'
import { LONG_WALK_S } from '../lib/activities'
import { walkPhases } from '../lib/guidedPhases'

export function LongWalk() {
  return (
    <GuidedSession
      title="Marche"
      finishedTitle="Marche terminée"
      kind="marche_longue"
      phases={walkPhases(LONG_WALK_S)}
      startTone="recup"
      offerStretch={false}
      intro={
        <>
          <h1>Marche de {LONG_WALK_S / 60} min</h1>
          <p className={styles.muted}>{program.rules.deload_rule}</p>
        </>
      }
    />
  )
}
