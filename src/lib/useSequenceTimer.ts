import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { unlockAudio } from './sound'
import {
  advanceClock,
  elapsedMs,
  idleClock,
  locate,
  pauseClock,
  startClock,
  type Clock,
  type Position,
  type TimedPhase,
} from './timer'

interface SequenceOptions {
  onPhaseStart?: (index: number) => void
  onMark?: (index: number) => void
  onDone?: () => void
}

export interface SequenceTimer {
  position: Position
  running: boolean
  resume: () => void
  pause: () => void
  skipPhase: () => void
}

const TICK_MS = 200

/** Starts as soon as it is mounted: every timer screen is opened by a tap on "start". */
export function useSequenceTimer(phases: TimedPhase[], options: SequenceOptions = {}): SequenceTimer {
  const [clock, setClock] = useState<Clock>(() => startClock(idleClock, Date.now()))
  const [now, setNow] = useState(() => Date.now())
  const position = locate(phases, elapsedMs(clock, now))
  const running = clock.runningSince !== null && !position.done

  useEffect(() => {
    if (!running) return
    const refresh = () => setNow(Date.now())
    const interval = window.setInterval(refresh, TICK_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [running])

  // Remember what was already announced so a re-render never beeps twice.
  const announced = useRef({ index: -1, mark: -1, done: false })
  const announce = useEffectEvent((current: Position) => {
    const seen = announced.current
    if (current.done) {
      if (!seen.done) options.onDone?.()
      seen.done = true
      return
    }
    if (current.index !== seen.index) {
      seen.index = current.index
      options.onPhaseStart?.(current.index)
    }
    const markMs = phases[current.index].markMs
    if (markMs !== undefined && current.phaseElapsedMs >= markMs && seen.mark !== current.index) {
      seen.mark = current.index
      options.onMark?.(current.index)
    }
  })

  useEffect(() => announce(position), [position])

  return {
    position,
    running,
    resume: () => {
      // A call or a locked screen can suspend audio on iOS; this tap lets it play again.
      unlockAudio()
      const time = Date.now()
      setNow(time)
      setClock((previous) => startClock(previous, time))
    },
    pause: () => {
      const time = Date.now()
      setNow(time)
      setClock((previous) => pauseClock(previous, time))
    },
    skipPhase: () => {
      const time = Date.now()
      setNow(time)
      setClock((previous) => advanceClock(previous, locate(phases, elapsedMs(previous, time)).remainingMs))
    },
  }
}
