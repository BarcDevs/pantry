import { expect, test } from '@playwright/test'

import { signUp } from './helpers/auth'

test('sign up, skip onboarding, land on pantry home', async ({ page }) => {
    test.setTimeout(90000)
    await signUp(page)

    await expect(page.getByText('המזווה שלי')).toBeVisible()
    await expect(page.getByText('המזווה ריק')).toBeVisible()
})
