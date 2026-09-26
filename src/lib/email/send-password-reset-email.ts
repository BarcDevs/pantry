import { readFileSync } from 'fs'
import { join } from 'path'

import { getRequestOrigin } from '@/lib/get-request-origin'

import { authTexts } from '@/constants/texts/auth'

import appConfig from '@/config/app'
import { resend } from '@/config/email'
import env from '@/config/env'

const TEMPLATE_PATH = join(process.cwd(), 'src/lib/email/templates/password-reset.html')

type SendPasswordResetEmailInput = {
    email: string
    code: string
    expiresMinutes: number
}

export const sendPasswordResetEmail = async ({
    email,
    code,
    expiresMinutes
}: SendPasswordResetEmailInput): Promise<void> => {
    const origin = await getRequestOrigin()
    const resetUrl = `${origin}/forgot-password?email=${encodeURIComponent(email)}&code=${code}`
    const supportUrl = `mailto:${appConfig.supportEmail}`

    const html = readFileSync(TEMPLATE_PATH, 'utf-8')
        .replaceAll('{{code}}', code)
        .replaceAll('{{reset_url}}', resetUrl)
        .replaceAll('{{email}}', email)
        .replaceAll('{{expires_minutes}}', String(expiresMinutes))
        .replaceAll('{{support_url}}', supportUrl)

    if (env.e2eMockEmail) {
        console.warn(`[E2E_MOCK_EMAIL] password reset code for ${email}: ${code}`)
        return
    }

    await resend.emails.send({
        from: appConfig.resendFromEmail,
        to: email,
        subject: authTexts.resetEmailSubject,
        html
    })
}
