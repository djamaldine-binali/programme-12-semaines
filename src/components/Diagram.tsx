import type { Exercise } from '../data/types'
import styles from './Diagram.module.css'

interface DiagramProps {
  exercise: Exercise
  size?: 'small' | 'large'
}

// The SVG markup comes from program.json, which ships with the app (program.test.ts checks it starts with <svg).
// The wrapper carries the accessible name, so the inner SVG is hidden from screen readers.
function decorativeSvg(markup: string): string {
  return markup.replace('role="img"', 'aria-hidden="true"')
}

export function Diagram({ exercise, size = 'small' }: DiagramProps) {
  return (
    <div
      className={`${styles.frame} ${styles[size]}`}
      role="img"
      aria-label={`Schéma : ${exercise.name}`}
      dangerouslySetInnerHTML={{ __html: decorativeSvg(exercise.diagram_svg) }}
    />
  )
}
