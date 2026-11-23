import { Droplets, GlassWater, Undo2 } from 'lucide-react'
import { BOTTLE_ML, expectedMl, formatCentilitres, formatLitres, GLASS_ML, suggestedSipMl } from '../lib/water'
import type { WaterDay } from '../lib/useWater'
import styles from './WaterTracker.module.css'

function statusText(goalMl: number, totalMl: number, now: Date): string {
  if (goalMl > 0 && totalMl >= goalMl) return "Objectif atteint pour aujourd'hui."
  const sip = suggestedSipMl(goalMl, totalMl, now)
  if (!sip) return 'Tu es dans les temps.'
  return `À cette heure, vise ${formatLitres(expectedMl(goalMl, now))}. Bois ${formatCentilitres(sip)} maintenant.`
}

export function WaterTracker({ water, now }: { water: WaterDay; now: Date }) {
  const { totalMl, goalMl } = water
  const progress = goalMl > 0 ? Math.min(1, totalMl / goalMl) : 0

  return (
    <div className={styles.tracker}>
      <p className={styles.amount}>
        <Droplets size={26} aria-hidden="true" />
        <span>
          <strong>{formatLitres(totalMl)}</strong> sur {formatLitres(goalMl)}
        </span>
      </p>
      <div
        className={styles.bar}
        role="progressbar"
        aria-label="Eau bue aujourd'hui"
        aria-valuemin={0}
        aria-valuemax={goalMl}
        aria-valuenow={totalMl}
        aria-valuetext={`${formatLitres(totalMl)} sur ${formatLitres(goalMl)}`}
      >
        <span style={{ width: `${progress * 100}%` }} />
      </div>
      <p className={styles.status} aria-live="polite">
        {statusText(goalMl, totalMl, now)}
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.add} onClick={() => water.drink(GLASS_ML)}>
          <GlassWater size={20} aria-hidden="true" />
          <span className={styles.label}>
            Un verre <span className={styles.small}>{formatCentilitres(GLASS_ML)}</span>
          </span>
        </button>
        <button type="button" className={styles.add} onClick={() => water.drink(BOTTLE_ML)}>
          <GlassWater size={20} aria-hidden="true" />
          <span className={styles.label}>
            Une gourde <span className={styles.small}>{formatCentilitres(BOTTLE_ML)}</span>
          </span>
        </button>
      </div>
      {water.intakes.length > 0 && (
        <button type="button" className={styles.undo} onClick={water.undoLast}>
          <Undo2 size={16} aria-hidden="true" />
          Annuler le dernier ({formatCentilitres(water.intakes.at(-1)!.ml)})
        </button>
      )}
    </div>
  )
}
