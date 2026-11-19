import { X } from 'lucide-react'
import { useState } from 'react'
import { goBack } from '../lib/router'
import { useLeaveGuard } from '../lib/useLeaveGuard'
import { ConfirmDialog } from './ConfirmDialog'
import styles from './SessionHeader.module.css'

interface SessionHeaderProps {
  title: string
  progress?: string
  /** Ask before leaving when something would be lost. */
  confirmQuit: boolean
}

export function SessionHeader({ title, progress, confirmQuit }: SessionHeaderProps) {
  const [asking, setAsking] = useState(false)
  const leave = useLeaveGuard(confirmQuit, () => setAsking(true))

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.quit}
        aria-label="Quitter la séance"
        onClick={() => (confirmQuit ? setAsking(true) : goBack())}
      >
        <X size={26} aria-hidden="true" />
      </button>
      <p className={styles.title}>{title}</p>
      {progress && <p className={styles.progress}>{progress}</p>}
      <ConfirmDialog
        open={asking}
        title="Quitter la séance ?"
        message="Elle ne sera pas enregistrée comme faite."
        confirmLabel="Quitter"
        cancelLabel="Continuer"
        onConfirm={leave}
        onCancel={() => setAsking(false)}
      />
    </header>
  )
}
