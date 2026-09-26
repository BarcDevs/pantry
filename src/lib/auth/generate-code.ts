import { randomInt } from 'crypto'

import { minuteInMs } from '@/constants/time'

export const generateVerificationCode = (): string => (
    randomInt(100000, 1000000).toString()
)

export const verificationCodeTtlMs = 15 * minuteInMs
