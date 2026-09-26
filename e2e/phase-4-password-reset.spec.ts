import { expect, test } from '@playwright/test'

import { resetPassword, signUp } from './helpers/auth'

test('forgot password -> code -> new password -> auto sign in', async ({ page }) => {
    const { email } = await signUp(page)
    const newPassword = `Zr7!qP${Date.now()}wN`

    await resetPassword(page, email, newPassword)
    await expect(page).toHaveURL(/\/pantry/)

    await page.goto('/sign-in')
    await page.getByRole('textbox', { name: 'כתובת אימייל' }).fill(email)
    await page.getByRole('textbox', { name: 'סיסמה' }).fill(newPassword)
    await page.getByRole('button', { name: 'כניסה', exact: true }).click()
    await page.waitForURL('**/pantry', { timeout: 15000 })
})
