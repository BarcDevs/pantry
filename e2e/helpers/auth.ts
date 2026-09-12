import { type Page } from '@playwright/test'

export const signUp = async (page: Page): Promise<void> => {
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
}
