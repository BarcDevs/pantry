import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { type Page } from '@playwright/test'

export const signUp = async (page: Page): Promise<void> => {
    await setupClerkTestingToken({ page })

    const email = `testuser+clerk_test+${Date.now()}@example.com`
    const password = `Xq9!zR${Date.now()}vK`

    await page.goto('/sign-up')
    await page.getByRole('textbox', { name: 'שם מלא' }).fill('בודק בדיקה')
    await page.getByRole('textbox', { name: 'כתובת אימייל' }).fill(email)
    await page.getByRole('textbox', { name: 'סיסמה' }).fill(password)
    await page.getByRole('button', { name: 'יצירת חשבון', exact: true }).click()

    const codeInput = page.getByRole('textbox', { name: 'קוד אימות' })
    await codeInput.waitFor({ state: 'visible', timeout: 15000 })
    await codeInput.pressSequentially('424242', { delay: 100 })
    await page.getByRole('button', { name: 'אימות' }).click()

    await page.waitForURL('**/onboarding', { timeout: 30000 })
    await page.getByRole('button', { name: 'דילוג' }).click()
    await page.getByRole('button', { name: 'דילוג' }).click()
    await page.getByRole('button', { name: 'סיום' }).click()
    await page.waitForURL('**/pantry', { timeout: 15000 })
}
