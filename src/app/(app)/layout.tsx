import type { LayoutProps } from '@/types'

import { ensureUser } from '@/actions/users/ensure-user'

const AppLayout = async ({ children }: LayoutProps) => {
    await ensureUser()
    return <>{children}</>
}

export default AppLayout
