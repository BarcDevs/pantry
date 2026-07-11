import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

test('sign up, skip onboarding, land on pantry home', async ({ page }) => {
    test.setTimeout(90000)
    await setupClerkTestingToken({ page })

    const email = `testuser+clerk_test+${Date.now()}@example.com`
    const password = `Xq9!zR${Date.now()}vK`

    await page.goto('/sign-up')
    await page.getByRole('textbox', { name: 'כתובת דוא"ל' }).fill(email)
    await page.getByRole('textbox', { name: 'סיסמה' }).fill(password)
    await page.getByRole('button', { name: 'המשך', exact: true }).click()

    const codeInput = page.getByRole('textbox', { name: 'Enter verification code' })
    await codeInput.waitFor({ state: 'visible', timeout: 15000 })
    await codeInput.pressSequentially('424242', { delay: 100 })

    await page.waitForURL('**/onboarding', { timeout: 30000 })
    await page.getByRole('button', { name: 'דילוג' }).click()
    await page.getByRole('button', { name: 'דילוג' }).click()
    await page.getByRole('button', { name: 'סיום' }).click()

    await page.waitForURL('**/pantry', { timeout: 15000 })
    await expect(page.getByText('המזווה שלי')).toBeVisible()
    await expect(page.getByText('המזווה ריק')).toBeVisible()
})
