import { useState, type ReactNode } from 'react'
import type { GuidedPhase } from '../lib/guidedPhases'
import { unlockAudio } from '../lib/sound'
import type { SessionKind } from '../lib/storage'
import { useWakeLock } from '../lib/useWakeLock'
import { useLogSession } from '../state/useLogSession'
import buttons from './buttons.module.css'
import { FinishPanel } from './FinishPanel'
import { GuidedRunner } from './GuidedRunner'
import { SessionHeader } from './SessionHeader'
import styles from './GuidedSession.module.css'
import layout from './sessionLayout.module.css'

interface GuidedSessionProps {
  title: string
  finishedTitle: string
  kind: SessionKind
  phases: GuidedPhase[]
  intro: ReactNode
  /** Shown under the timer while the session runs. */
  duringRun?: ReactNode
  startTone: 'course' | 'recup'
  markMessage?: string
  offerStretch: boolean
  finishExtras?: (finishedAt: string) => ReactNode
}

export function GuidedSession(props: GuidedSessionProps) {
  const logSession = useLogSession()
  const [stage, setStage] = useState<'intro' | 'running' | 'finished'>('intro')
  const [finishedAt, setFinishedAt] = useState<string | null>(null)
  useWakeLock(stage === 'running')

  function finish() {
    setFinishedAt(logSession(props.kind))
    setStage('finished')
  }

  if (stage === 'finished' && finishedAt) {
    return (
      <div className={layout.screen}>
        <FinishPanel title={props.finishedTitle} finishedAt={finishedAt} offerStretch={props.offerStretch}>
          {props.finishExtras?.(finishedAt)}
        </FinishPanel>
      </div>
    )
  }

  return (
    <div className={layout.screen}>
      <SessionHeader title={props.title} confirmQuit={stage === 'running'} />
      {stage === 'running' ? (
        <GuidedRunner phases={props.phases} markMessage={props.markMessage} onDone={finish}>
          {props.duringRun}
        </GuidedRunner>
      ) : (
        <>
          <div className={styles.intro}>{props.intro}</div>
          <div className={layout.actions}>
            <button
              type="button"
              className={`${buttons.button} ${buttons[props.startTone]} ${buttons.block}`}
              onClick={() => {
                unlockAudio()
                setStage('running')
              }}
            >
              Démarrer
            </button>
          </div>
        </>
      )}
    </div>
  )
}
