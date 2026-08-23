import { redirect } from 'next/navigation'

import { SettingsView } from '@/components/settings/settings-view'
import { PageHeader } from '@/components/shared/PageHeader'

import { routes } from '@/constants/routes'
import { settingsTexts } from '@/constants/texts/settings'

import { ensureUser } from '@/actions/users/ensure-user'

const SettingsPage = async () => {
    const user = await ensureUser()
    if (!user) redirect(routes.signIn)

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader title={settingsTexts.title}/>
            <SettingsView user={user}/>
        </main>
    )
}

export default SettingsPage
