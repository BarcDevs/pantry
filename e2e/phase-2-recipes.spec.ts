import {
    type Browser,
    type BrowserContext,
    expect,
    type Page,
    test
} from '@playwright/test'

import { signUp } from './helpers/auth'

const PANTRY_ITEMS = ['עגבניות', 'בצל', 'ביצים', 'גבינה צהובה', 'לחם']

const addPantryItem = async (page: Page, name: string) => {
    await page.goto('/add')
    await page.getByRole('textbox', { name: 'שם המוצר' }).fill(name)
    await page.getByRole('spinbutton', { name: 'כמות' }).fill('2')
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'הוספה למזווה' }).click()
    await page.waitForURL('**/pantry', { timeout: 30000 })
}

const seedPantry = async (page: Page) => {
    for (const name of PANTRY_ITEMS) {
        await addPantryItem(page, name)
    }
}

// Signing up hits Clerk's rate-limited dev instance, so the whole suite
// shares one authenticated session (via storageState) instead of one
// sign-up per test.
let sharedStorageState: Awaited<ReturnType<BrowserContext['storageState']>> | undefined

const createAuthedPage = async (browser: Browser): Promise<Page> => {
    const context = sharedStorageState
        ? await browser.newContext({ storageState: sharedStorageState })
        : await browser.newContext()
    return context.newPage()
}

test.describe.configure({ mode: 'serial' })

test.describe('phase 2 — recipes', () => {
    test.beforeAll(async ({ browser }) => {
        test.setTimeout(90000)
        const page = await createAuthedPage(browser)
        await signUp(page)
        await seedPantry(page)
        sharedStorageState = await page.context().storageState()
        await page.close()
    })

    test('generate (pantry-first) -> refine -> save -> cook -> deduct -> rate -> library', async ({ browser }) => {
        test.setTimeout(120000)
        const page = await createAuthedPage(browser)

        await page.goto('/generate')
        await page.getByRole('button', { name: 'רק מהמזווה' }).waitFor()
        await page.getByRole('button', { name: '✦ צור מתכון' }).click()

        await page.waitForURL('**/generate/result', { timeout: 30000 })
        await expect(page.getByText('מהמלאי')).toBeVisible()

        await page.getByPlaceholder('לדוגמה: הוסיפו חריפות, הפכו לצמחוני').fill('הוסיפו קצת פלפל')
        await page.getByRole('button', { name: 'עדכון מתכון' }).click()
        await expect(page.getByText('(מעודכן)')).toBeVisible({ timeout: 30000 })

        await page.getByRole('button', { name: 'שמירה לספרייה' }).click()
        await expect(page.getByText('נשמר')).toBeVisible({ timeout: 15000 })

        await page.getByRole('button', { name: /התחל לבשל/ }).click()
        await page.waitForURL('**/recipes/*/cook', { timeout: 15000 })

        await page.getByRole('button', { name: 'סיום בישול' }).click()
        await page.waitForURL('**/recipes/*/deduct', { timeout: 15000 })

        await page.getByRole('button', { name: 'דלג — השאר את המזווה ללא שינוי' }).click()
        await page.waitForURL('**/recipes/*/rate', { timeout: 15000 })

        await page.getByRole('button', { name: '3 כוכבים' }).click()
        await page.getByRole('button', { name: 'סיום ושמירה בהיסטוריה' }).click()
        await page.waitForURL('**/pantry', { timeout: 15000 })

        await page.goto('/recipes')
        await expect(page.getByRole('heading', { name: 'המתכונים שלי' })).toBeVisible()

        await page.getByPlaceholder('חיפוש מתכון...').fill('לא קיים בכלל')
        await expect(page.getByText('לא נמצאו מתכונים תואמים')).toBeVisible()
        await page.getByPlaceholder('חיפוש מתכון...').fill('')

        await page.getByRole('button', { name: 'בושלו' }).click()
        await expect(page.getByText('לא נמצאו מתכונים תואמים')).not.toBeVisible()

        await page.getByRole('button', { name: 'מועדפים', exact: true }).click()
        await expect(page.getByText('לא נמצאו מתכונים תואמים')).toBeVisible()

        await page.getByRole('button', { name: 'הכל' }).click()
        await page.getByRole('button', { name: 'הוסף למועדפים' }).first().click()

        await page.getByRole('button', { name: 'מועדפים', exact: true }).click()
        await expect(page.getByText('לא נמצאו מתכונים תואמים')).not.toBeVisible()

        await page.close()
    })

    for (const [scopeLabel, scopeName] of [
        ['בעיקר מהמזווה', 'pantry-first'],
        ['פתוח', 'open']
    ] as const) {
        test(`generate config accepts "${scopeName}" scope and reaches result`, async ({ browser }) => {
            test.setTimeout(60000)
            const page = await createAuthedPage(browser)

            await page.goto('/generate')
            await page.getByRole('button', { name: 'רק מהמזווה' }).waitFor()
            await page.getByRole('button', { name: scopeLabel }).click()
            await page.getByRole('button', { name: '✦ צור מתכון' }).click()

            await page.waitForURL('**/generate/result', { timeout: 30000 })
            await expect(page.getByText('מהמלאי')).toBeVisible()

            await page.close()
        })
    }
})
