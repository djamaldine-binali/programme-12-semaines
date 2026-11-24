import styles from './Settings.module.css'

interface ChoiceGroupProps<T extends string | number> {
  legend: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** One option per line, for answers too long to sit side by side. */
  stacked?: boolean
}

export function ChoiceGroup<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  stacked = false,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className={styles.choices}>
      <legend>{legend}</legend>
      <div className={stacked ? styles.choiceStack : styles.choiceRow}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={legend}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
