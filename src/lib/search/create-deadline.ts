import { minStepBudgetMs } from '@/constants/search'

export type Deadline = {
    remainingMs: () => number
    /** The step's own cap, clipped to what is left of the budget. */
    clip: (capMs: number) => number
    /** False once too little budget is left to usefully start another step. */
    canStart: () => boolean
}

export const createDeadline = (
    budgetMs: number,
    now: () => number
): Deadline => {
    const endsAt = now() + budgetMs
    const remainingMs = (): number => Math.max(0, endsAt - now())
    return {
        remainingMs,
        clip: (capMs) => Math.min(capMs, remainingMs()),
        canStart: () => remainingMs() >= minStepBudgetMs
    }
}
