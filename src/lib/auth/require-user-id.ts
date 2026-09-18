import { auth } from '@/lib/auth'

import { ActionError } from '@/constants/errors'

export const requireUserId = async (): Promise<string> => {
    const session = await auth()
    if (!session?.user?.id) throw new Error(ActionError.Unauthenticated)
    return session.user.id
}
