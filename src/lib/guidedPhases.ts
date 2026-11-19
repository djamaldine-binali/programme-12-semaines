import { program } from '../data/program'
import type { SaturdayIntervals, TuesdayRun } from '../data/types'
import type { Tone } from './activities'
import type { Cue } from './sound'
import type { TimedPhase } from './timer'

export interface GuidedPhase extends TimedPhase {
  label: string
  tone: Tone
  cue: Cue
  /** Extra line under the label, e.g. "3 sur 8" or the move to do. */
  detail?: string
}

const { warmup_walk_s: warmupS, cooldown_walk_s: cooldownS } = program.running

const warmup: GuidedPhase = {
  label: 'Échauffement',
  detail: 'Marche rapide',
  tone: 'recup',
  cue: 'rest',
  durationMs: warmupS * 1000,
}

const cooldown: GuidedPhase = {
  label: 'Retour au calme',
  detail: 'Marche',
  tone: 'recup',
  cue: 'rest',
  durationMs: cooldownS * 1000,
}

function repeat(reps: number, makeRep: (rep: number) => GuidedPhase[]): GuidedPhase[] {
  return Array.from({ length: reps }, (_, index) => makeRep(index + 1)).flat()
}

export function runPhases(run: TuesdayRun): GuidedPhase[] {
  if (run.continuous && run.run_s_max) {
    const main: GuidedPhase = {
      label: 'Course',
      detail: `${run.run_s / 60} à ${run.run_s_max / 60} min sans t'arrêter`,
      tone: 'course',
      cue: 'work',
      durationMs: run.run_s_max * 1000,
      markMs: run.run_s * 1000,
    }
    return [warmup, main, cooldown]
  }
  const reps = repeat(run.reps, (rep) => [
    { label: 'Course', detail: `${rep} sur ${run.reps}`, tone: 'course', cue: 'work', durationMs: run.run_s * 1000 },
    { label: 'Marche', detail: `${rep} sur ${run.reps}`, tone: 'recup', cue: 'rest', durationMs: run.walk_s * 1000 },
  ])
  return [warmup, ...reps, cooldown]
}

export function intervalPhases(intervals: SaturdayIntervals): GuidedPhase[] {
  if (intervals.mode === 'maison') {
    const { moves } = intervals
    return repeat(intervals.reps, (rep) => [
      {
        label: moves[(rep - 1) % moves.length],
        detail: `À fond, ${rep} sur ${intervals.reps}`,
        tone: 'course',
        cue: 'work',
        durationMs: intervals.work_s * 1000,
      },
      {
        label: 'Récupère',
        detail: `Tranquille, ${rep} sur ${intervals.reps}`,
        tone: 'recup',
        cue: 'rest',
        durationMs: intervals.rest_s * 1000,
      },
    ])
  }
  const reps = repeat(intervals.reps, (rep) => [
    {
      label: 'Vite',
      detail: `${rep} sur ${intervals.reps}`,
      tone: 'course',
      cue: 'work',
      durationMs: intervals.work_s * 1000,
    },
    {
      label: 'Marche',
      detail: `${rep} sur ${intervals.reps}`,
      tone: 'recup',
      cue: 'rest',
      durationMs: intervals.rest_s * 1000,
    },
  ])
  return [warmup, ...reps, cooldown]
}

export function walkPhases(durationS: number): GuidedPhase[] {
  return [{ label: 'Marche', detail: 'À ton rythme', tone: 'recup', cue: 'rest', durationMs: durationS * 1000 }]
}

export function totalDurationMs(phases: TimedPhase[]): number {
  return phases.reduce((total, phase) => total + phase.durationMs, 0)
}
