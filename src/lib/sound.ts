export type Cue = 'work' | 'rest' | 'switch' | 'mark' | 'done'

interface Tone {
  frequency: number
  durationS: number
  delayS: number
}

// Each phase has its own sound so it can be recognised without looking at the screen.
const tones: Record<Cue, Tone[]> = {
  work: [
    { frequency: 880, durationS: 0.12, delayS: 0 },
    { frequency: 880, durationS: 0.12, delayS: 0.18 },
  ],
  rest: [{ frequency: 440, durationS: 0.45, delayS: 0 }],
  switch: [{ frequency: 660, durationS: 0.15, delayS: 0 }],
  mark: [{ frequency: 1046, durationS: 0.08, delayS: 0 }],
  done: [
    { frequency: 523, durationS: 0.15, delayS: 0 },
    { frequency: 659, durationS: 0.15, delayS: 0.18 },
    { frequency: 784, durationS: 0.3, delayS: 0.36 },
  ],
}

const vibrations: Record<Cue, number[]> = {
  work: [150, 80, 150],
  rest: [400],
  switch: [120],
  mark: [60],
  done: [200, 100, 200, 100, 400],
}

let context: AudioContext | null = null

/**
 * Browsers (iOS in particular) only allow audio after a tap.
 * Call this from the click handler that starts a timer.
 */
export function unlockAudio(): void {
  if (typeof AudioContext === 'undefined') return
  context ??= new AudioContext()
  if (context.state === 'suspended') void context.resume()
}

function playTones(cue: Cue): void {
  if (!context || context.state !== 'running') return
  const start = context.currentTime
  for (const tone of tones[cue]) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const toneStart = start + tone.delayS
    const toneEnd = toneStart + tone.durationS
    oscillator.frequency.value = tone.frequency
    // Short fade in and out to avoid clicks.
    gain.gain.setValueAtTime(0, toneStart)
    gain.gain.linearRampToValueAtTime(0.4, toneStart + 0.01)
    gain.gain.setValueAtTime(0.4, toneEnd - 0.03)
    gain.gain.linearRampToValueAtTime(0, toneEnd)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(toneStart)
    oscillator.stop(toneEnd)
  }
}

export function playCue(cue: Cue, options: { sound: boolean; vibration: boolean }): void {
  if (options.sound) playTones(cue)
  if (options.vibration && 'vibrate' in navigator) navigator.vibrate(vibrations[cue])
}
