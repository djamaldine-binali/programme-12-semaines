import type { Exercise } from '../data/types'
import styles from './Diagram.module.css'

interface DiagramProps {
  exercise: Exercise
  size?: 'small' | 'large'
}

// The SVG markup comes from program.json, which ships with the app (program.test.ts checks it starts with <svg).
export function Diagram({ exercise, size = 'small' }: DiagramProps) {
  return (
    <div
      className={`${styles.frame} ${styles[size]}`}
      role="img"
      aria-label={`Schéma : ${exercise.name}. En gris la position de départ, en noir l'arrivée.`}
      dangerouslySetInnerHTML={{ __html: exercise.diagram_svg }}
    />
  )
}
