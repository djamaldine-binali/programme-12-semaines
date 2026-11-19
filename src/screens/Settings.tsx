import { ChevronLeft } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import buttons from '../components/buttons.module.css'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StartDateField } from '../components/StartDateField'
import { navigate } from '../lib/router'
import { isValidStartDate, upcomingMonday } from '../lib/schedule'
import { playCue, unlockAudio } from '../lib/sound'
import { defaultState, parseState, type RestSeconds, type SavedState, type Theme } from '../lib/storage'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import { ChoiceGroup } from './ChoiceGroup'
import styles from './Settings.module.css'

const restOptions: { value: RestSeconds; label: string }[] = [
  { value: 60, label: '60 s' },
  { value: 75, label: '75 s' },
  { value: 90, label: '90 s' },
]

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
]

function downloadProgress(state: SavedState, today: string) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `programme-12-semaines-${today}.json`
  link.click()
  // Revoking right away can cancel the download on iOS Safari.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

// Keyed on the saved date so the field resets after an import or a reset.
function StartDateSection() {
  const { state, update } = useAppState()
  const today = useToday()
  const [startDate, setStartDate] = useState(state.startDate ?? upcomingMonday(today))

  return (
    <section className={styles.section} aria-labelledby="start-title">
      <h2 id="start-title">Début du programme</h2>
      <StartDateField value={startDate} onChange={setStartDate} />
      <button
        type="button"
        className={`${buttons.button} ${buttons.secondary}`}
        disabled={!isValidStartDate(startDate) || startDate === state.startDate}
        onClick={() => update((previous) => ({ ...previous, startDate }))}
      >
        Enregistrer la date
      </button>
    </section>
  )
}

export function Settings() {
  const { state, update } = useAppState()
  const today = useToday()
  const { settings } = state
  const [pendingImport, setPendingImport] = useState<SavedState | null>(null)
  const [importError, setImportError] = useState('')
  const [askingReset, setAskingReset] = useState(false)
  const canVibrate = 'vibrate' in navigator

  function updateSettings(change: Partial<SavedState['settings']>) {
    update((previous) => ({ ...previous, settings: { ...previous.settings, ...change } }))
  }

  async function readImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const imported = parseState(await file.text())
    if (imported) {
      setImportError('')
      setPendingImport(imported)
    } else {
      setImportError("Ce fichier n'est pas une sauvegarde du programme. Choisis le fichier .json exporté depuis l'app.")
    }
  }

  return (
    <div className={styles.page}>
      <a href="#/" className={styles.back}>
        <ChevronLeft size={20} aria-hidden="true" />
        Aujourd'hui
      </a>
      <h1>Réglages</h1>

      <StartDateSection key={state.startDate ?? 'none'} />

      <section className={styles.section} aria-labelledby="session-title">
        <h2 id="session-title">Pendant les séances</h2>
        <ChoiceGroup
          legend="Repos entre les séries"
          options={restOptions}
          value={settings.restSeconds}
          onChange={(restSeconds) => updateSettings({ restSeconds })}
        />
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(event) => updateSettings({ sound: event.target.checked })}
          />
          Sons
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.vibration}
            onChange={(event) => updateSettings({ vibration: event.target.checked })}
          />
          Vibrations
        </label>
        {!canVibrate && (
          <p className={styles.muted}>Ce navigateur ne gère pas les vibrations (c'est le cas sur iPhone).</p>
        )}
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary}`}
          onClick={() => {
            unlockAudio()
            playCue('done', settings)
          }}
        >
          Tester le signal
        </button>
      </section>

      <section className={styles.section} aria-labelledby="look-title">
        <h2 id="look-title">Affichage</h2>
        <ChoiceGroup
          legend="Thème"
          options={themeOptions}
          value={settings.theme}
          onChange={(theme) => updateSettings({ theme })}
        />
      </section>

      {state.runShift > 0 && (
        <section className={styles.section} aria-labelledby="run-title">
          <h2 id="run-title">Course</h2>
          <p>
            Ta course a {state.runShift} {state.runShift > 1 ? 'semaines' : 'semaine'} de décalage, parce que tu as
            refait ou reculé une étape.
          </p>
          <button
            type="button"
            className={`${buttons.button} ${buttons.secondary}`}
            onClick={() => update((previous) => ({ ...previous, runShift: 0 }))}
          >
            Remettre la course au calendrier
          </button>
        </section>
      )}

      <section className={styles.section} aria-labelledby="data-title">
        <h2 id="data-title">Ta progression</h2>
        <p className={styles.muted}>
          Elle reste sur ce téléphone. Exporte-la pour la garder ou la passer sur un autre appareil.
        </p>
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary}`}
          onClick={() => downloadProgress(state, today)}
        >
          Exporter (fichier .json)
        </button>
        <label className={`${buttons.button} ${buttons.secondary} ${styles.fileButton}`}>
          Importer un fichier
          <input type="file" accept="application/json,.json" onChange={readImport} className="visually-hidden" />
        </label>
        {importError && (
          <p className={styles.error} role="alert">
            {importError}
          </p>
        )}
        <button type="button" className={`${buttons.button} ${buttons.secondary}`} onClick={() => setAskingReset(true)}>
          Tout remettre à zéro
        </button>
      </section>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Remplacer ta progression ?"
        message="Les séances et réglages de ce fichier remplaceront ceux de ce téléphone."
        confirmLabel="Remplacer"
        cancelLabel="Annuler"
        onConfirm={() => {
          if (pendingImport) update(() => pendingImport)
          setPendingImport(null)
        }}
        onCancel={() => setPendingImport(null)}
      />
      <ConfirmDialog
        open={askingReset}
        title="Tout remettre à zéro ?"
        message="La date de début, les séances faites et les réglages seront effacés. Exporte d'abord si tu veux les garder."
        confirmLabel="Effacer"
        cancelLabel="Annuler"
        onConfirm={() => {
          update(() => defaultState)
          setAskingReset(false)
          navigate('/')
        }}
        onCancel={() => setAskingReset(false)}
      />
    </div>
  )
}
