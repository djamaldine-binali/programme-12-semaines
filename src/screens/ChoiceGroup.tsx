import styles from './Settings.module.css'

interface ChoiceGroupProps<T extends string | number> {
  legend: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function ChoiceGroup<T extends string | number>({ legend, options, value, onChange }: ChoiceGroupProps<T>) {
  return (
    <fieldset className={styles.choices}>
      <legend>{legend}</legend>
      <div className={styles.choiceRow}>
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
