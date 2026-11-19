import programJson from './program.json'
import type { Program } from './types'

// JSON imports widen string literals to string; program.test.ts checks the values the cast assumes.
export const program = programJson as Program
