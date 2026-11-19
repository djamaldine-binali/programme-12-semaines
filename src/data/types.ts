export type DayName = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche'

export type TemplateActivity =
  | 'renfo_A'
  | 'renfo_B'
  | 'renfo_A_ou_B'
  | 'course'
  | 'marche_posture'
  | 'fractionne'
  | 'posture_ou_repos'

export interface Meta {
  title: string
  language: string
  audience: string
  goals: { affiner: string; muscler: string }
  equipment: string[]
  never_show: string[]
}

export interface WeekTemplateDay {
  day: DayName
  activity: TemplateActivity
  detail?: string
}

export interface Rules {
  rest_between_sets_s: number[]
  deload_weeks: number[]
  deload_rule: string
  progression_rule: string
  stretch_after: string
  steps_per_day_by_month: number[]
  running_pain_rule: string
  listen_to_body: string
}

export interface Exercise {
  id: string
  name: string
  cue: string
  youtube_id: string
  youtube_url: string
  diagram_svg: string
}

export type DoseUnit = 'reps' | 'seconds' | 'taps'

export interface Dose {
  text: string
  sets: number
  /** "12", "12–15" or "max" */
  target: string
  unit: DoseUnit
  per_side: boolean
  note: string | null
}

export interface MonthVersion {
  month: 1 | 2 | 3
  exercise: string
  dose: Dose
}

export interface SessionItem {
  months: MonthVersion[]
}

export interface Session {
  title: string
  focus: string
  duration_min: number[]
  items: SessionItem[]
}

export interface RoutineItem {
  exercise: string
  dose: string
}

export interface PostureRoutine {
  when: string
  duration_min: number
  items: RoutineItem[]
}

export interface StretchRoutine {
  when: string
  duration_min: number[]
  hold_note: string
  items: RoutineItem[]
}

export interface TuesdayRun {
  week: number
  reps: number
  run_s: number
  walk_s: number
  deload: boolean
  run_s_max?: number
  continuous?: boolean
}

export interface HomeIntervals {
  month: 1
  mode: 'maison'
  reps: number
  work_s: number
  rest_s: number
  moves: string[]
  demo_exercise: string
}

export interface RunningIntervals {
  month: 2 | 3
  mode: 'course'
  reps: number
  work_s: number
  rest_s: number
  rest_mode: 'marche'
}

export type SaturdayIntervals = HomeIntervals | RunningIntervals

export interface Running {
  warmup_walk_s: number
  cooldown_walk_s: number
  pace_note: string
  tuesday_runs: TuesdayRun[]
  saturday_intervals: SaturdayIntervals[]
}

export interface Tip {
  title: string
  text: string
}

export interface Program {
  meta: Meta
  week_template: WeekTemplateDay[]
  rules: Rules
  exercises: Record<string, Exercise>
  sessions: { A: Session; B: Session }
  posture_routine: PostureRoutine
  stretch_routine: StretchRoutine
  running: Running
  nutrition: Tip[]
  daily_life: Tip[]
}
