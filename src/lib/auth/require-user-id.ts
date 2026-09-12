import { auth } from '@/lib/auth'

export const requireUserId = async (): Promise<string> => {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthenticated')
    return session.user.id
}
