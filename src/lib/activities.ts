import { program } from '../data/program'
import { formatDuration } from './format'
import { monthOfWeek, runStepFor, type Activity } from './schedule'
import type { SessionKind } from './storage'

export type Tone = 'renfo' | 'course' | 'recup'

export interface ActivityInfo {
  title: string
  summary: string
  tone: Tone
  path: string
  kind: SessionKind
}

// The deload rule says "marche de 30 min" but the JSON has no number for it.
export const LONG_WALK_S = 30 * 60

export function describeRun(step: number): string {
  const run = program.running.tuesday_runs[step - 1]
  if (run.continuous && run.run_s_max) {
    return `${run.run_s / 60} à ${run.run_s_max / 60} min sans t'arrêter`
  }
  return `${run.reps} × (${formatDuration(run.run_s)} de course + ${formatDuration(run.walk_s)} de marche)`
}

export function describeIntervals(month: number): string {
  const intervals = program.running.saturday_intervals[month - 1]
  if (intervals.mode === 'maison') {
    return `À la maison : ${intervals.reps} × ${formatDuration(intervals.work_s)} à fond / ${formatDuration(intervals.rest_s)} tranquille`
  }
  return `En courant : ${intervals.reps} × ${formatDuration(intervals.work_s)} vite / ${formatDuration(intervals.rest_s)} de marche`
}

function sessionSummary(id: 'A' | 'B'): string {
  const session = program.sessions[id]
  const [min, max] = session.duration_min
  return `${session.focus}, ${min} à ${max} min`
}

export function activityInfo(activity: Activity, week: number, runShift: number): ActivityInfo {
  switch (activity) {
    case 'renfo_A':
    case 'renfo_B': {
      const id = activity === 'renfo_A' ? 'A' : 'B'
      return {
        title: program.sessions[id].title,
        summary: sessionSummary(id),
        tone: 'renfo',
        path: `/seance/${id}`,
        kind: activity,
      }
    }
    case 'course': {
      const step = runStepFor(week, runShift)
      const summary = step === week ? describeRun(step) : `Étape de la semaine ${step} : ${describeRun(step)}`
      return { title: 'Course', summary, tone: 'course', path: '/course', kind: 'course' }
    }
    case 'fractionne':
      return {
        title: 'Fractionné',
        summary: describeIntervals(monthOfWeek(week)),
        tone: 'course',
        path: '/fractionne',
        kind: 'fractionne',
      }
    case 'marche_longue':
      return {
        title: `Marche de ${LONG_WALK_S / 60} min`,
        summary: 'Semaine allégée : la marche remplace le fractionné.',
        tone: 'recup',
        path: '/marche',
        kind: 'marche_longue',
      }
    case 'marche_posture':
      return {
        title: 'Marche et posture',
        summary: program.week_template.find((day) => day.activity === 'marche_posture')?.detail ?? '',
        tone: 'recup',
        path: '/routine/posture',
        kind: 'posture',
      }
    case 'posture_ou_repos':
      return {
        title: 'Posture ou repos',
        summary: `Routine posture de ${program.posture_routine.duration_min} min, ou une vraie journée de repos.`,
        tone: 'recup',
        path: '/routine/posture',
        kind: 'posture',
      }
  }
}
