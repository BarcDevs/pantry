import { type Page } from '@playwright/test'

type SignUpCredentials = {
    email: string
    password: string
}

export const signUp = async (page: Page): Promise<SignUpCredentials> => {
    const email = `testuser+${Date.now()}@example.com`
    const password = `Xq9!zR${Date.now()}vK`

    await page.goto('/sign-up')
    await page.getByRole('textbox', { name: 'שם מלא' }).fill('בודק בדיקה')
    await page.getByRole('textbox', { name: 'כתובת אימייל' }).fill(email)
    await page.getByRole('textbox', { name: 'סיסמה' }).fill(password)
    await page.getByRole('button', { name: 'יצירת חשבון', exact: true }).click()

    await page.waitForURL('**/onboarding', { timeout: 30000 })
    await page.getByRole('button', { name: 'דילוג' }).click()
    await page.getByRole('button', { name: 'דילוג' }).click()
    await page.getByRole('button', { name: 'סיום' }).click()
    await page.waitForURL('**/pantry', { timeout: 15000 })

    return { email, password }
}

export const resetPassword = async (
    page: Page,
    email: string,
    newPassword: string
): Promise<void> => {
    await page.goto('/forgot-password')
    await page.getByRole('textbox', { name: 'כתובת אימייל' }).fill(email)
    await page.getByRole('button', { name: 'שליחת קוד לאיפוס' }).click()

    const devCode = await page.getByTestId('dev-verification-code').textContent()
    const code = devCode?.replace(/\D/g, '') ?? ''
    await page.getByLabel('קוד האיפוס').fill(code)
    await page.getByRole('button', { name: 'אימות קוד' }).click()

    await page.getByRole('textbox', { name: 'סיסמה חדשה', exact: true }).fill(newPassword)
    await page.getByRole('textbox', { name: 'אימות סיסמה חדשה' }).fill(newPassword)
    await page.getByRole('button', { name: 'איפוס סיסמה' }).click()

    await page.waitForURL('**/pantry', { timeout: 15000 })
}
