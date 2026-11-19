import { useEffect, useEffectEvent, useRef, useState } from 'react'
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

interface SequenceCallbacks {
  onPhaseStart?: (index: number) => void
  onMark?: (index: number) => void
  onDone?: () => void
}

export interface SequenceTimer {
  position: Position
  running: boolean
  started: boolean
  start: () => void
  pause: () => void
  skipPhase: () => void
}

const TICK_MS = 200

export function useSequenceTimer(phases: TimedPhase[], callbacks: SequenceCallbacks = {}): SequenceTimer {
  const [clock, setClock] = useState<Clock>(idleClock)
  const [now, setNow] = useState(() => Date.now())
  const position = locate(phases, elapsedMs(clock, now))
  const running = clock.runningSince !== null && !position.done
  const started = clock.runningSince !== null || clock.bankedMs > 0

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
      if (!seen.done) callbacks.onDone?.()
      seen.done = true
      return
    }
    if (current.index !== seen.index) {
      seen.index = current.index
      callbacks.onPhaseStart?.(current.index)
    }
    const markMs = phases[current.index].markMs
    if (markMs !== undefined && current.phaseElapsedMs >= markMs && seen.mark !== current.index) {
      seen.mark = current.index
      callbacks.onMark?.(current.index)
    }
  })

  useEffect(() => {
    if (started) announce(position)
  }, [started, position])

  return {
    position,
    running,
    started,
    start: () => {
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
