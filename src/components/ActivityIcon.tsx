import { Dumbbell, Flower2, Footprints, Moon, PersonStanding, Zap, type LucideIcon } from 'lucide-react'
import type { SessionKind } from '../lib/storage'

const icons: Record<SessionKind, LucideIcon> = {
  renfo_A: Dumbbell,
  renfo_B: Dumbbell,
  course: Footprints,
  fractionne: Zap,
  marche_longue: PersonStanding,
  posture: Flower2,
  etirements: Moon,
}

export function ActivityIcon({ kind, size = 24 }: { kind: SessionKind; size?: number }) {
  const Icon = icons[kind]
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" />
}
