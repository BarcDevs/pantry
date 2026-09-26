import bcrypt from 'bcryptjs'

import type { UserDoc } from '@/types/user'

type VerifiableUser = Pick<UserDoc, 'resetCodeHash' | 'resetCodeExpiresAt'>

// TODO before a second real user exists: no attempt-lockout - a guessed code stays valid
// (unconsumed) for the rest of its 15-minute TTL, and forgotPasswordRequest lets it be
// re-armed indefinitely, so brute-forcing the 900k keyspace is unbounded in wall-clock
// time. Add a persisted resetCodeAttempts counter here (both call sites already funnel
// through this helper), lock out after ~5 failures, and rate-limit re-issuing a code.
export const isResetCodeValid = async (
    user: VerifiableUser | null,
    code: string
): Promise<boolean> => Boolean(
    user?.resetCodeHash
        && user.resetCodeExpiresAt
        && user.resetCodeExpiresAt.getTime() > Date.now()
        && await bcrypt.compare(code, user.resetCodeHash)
)
