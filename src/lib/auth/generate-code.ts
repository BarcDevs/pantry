export const generateVerificationCode = (): string => (
    Math.floor(100000 + Math.random() * 900000).toString()
)

export const verificationCodeTtlMs = 15 * 60 * 1000
