export interface TimedPhase {
  durationMs: number
  /** Optional point inside the phase, e.g. the low end of "30–45 s". */
  markMs?: number
}

/**
 * A clock never counts ticks: it stores when it was last started and how much time was banked before.
 * After the phone sleeps, the elapsed time is still exact.
 */
export interface Clock {
  runningSince: number | null
  bankedMs: number
}

export interface Position {
  index: number
  phaseElapsedMs: number
  remainingMs: number
  done: boolean
}

export const idleClock: Clock = { runningSince: null, bankedMs: 0 }

export function elapsedMs(clock: Clock, now: number): number {
  return clock.bankedMs + (clock.runningSince === null ? 0 : now - clock.runningSince)
}

export function startClock(clock: Clock, now: number): Clock {
  return clock.runningSince === null ? { runningSince: now, bankedMs: clock.bankedMs } : clock
}

export function pauseClock(clock: Clock, now: number): Clock {
  return { runningSince: null, bankedMs: elapsedMs(clock, now) }
}

export function advanceClock(clock: Clock, ms: number): Clock {
  return { ...clock, bankedMs: clock.bankedMs + ms }
}

export function locate(phases: TimedPhase[], elapsed: number): Position {
  let phaseStart = 0
  for (const [index, phase] of phases.entries()) {
    const phaseEnd = phaseStart + phase.durationMs
    if (elapsed < phaseEnd) {
      return { index, phaseElapsedMs: elapsed - phaseStart, remainingMs: phaseEnd - elapsed, done: false }
    }
    phaseStart = phaseEnd
  }
  return { index: phases.length - 1, phaseElapsedMs: phases.at(-1)?.durationMs ?? 0, remainingMs: 0, done: true }
}

/** Seconds shown on a countdown: 4.2 s left still reads 5, so 0 only appears at the very end. */
export function displaySeconds(remainingMs: number): number {
  return Math.ceil(remainingMs / 1000)
}
