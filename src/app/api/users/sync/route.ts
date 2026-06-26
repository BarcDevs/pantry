import { headers } from 'next/headers'

import { Webhook } from 'svix'

import type { ClerkEvent } from '@/types/user'

import connectDB from '@/lib/mongodb'

import env from '@/config/env'

import { UserModel } from '@/models/user.model'

export const POST = async (req: Request): Promise<Response> => {
    const headersList = await headers()
    const svixId = headersList.get('svix-id')
    const svixTimestamp = headersList.get('svix-timestamp')
    const svixSignature = headersList.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Missing svix headers', { status: 400 })
    }

    const payload = await req.text()
    const wh = new Webhook(env.clerkWebhookSecret)

    let event: ClerkEvent
    try {
        event = wh.verify(payload, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature
        }) as ClerkEvent
    } catch {
        return new Response('Invalid signature', {
            status: 401
        })
    }

    if (
        event.type === 'user.created'
        || event.type === 'user.updated'
    ) {
        const {
            id,
            email_addresses,
            first_name,
            last_name
        } = event.data
        const email = email_addresses[0]?.email_address ?? ''
        const displayName = [
            first_name,
            last_name
        ].filter(Boolean).join(' ') || email

        await connectDB()
        await UserModel.findOneAndUpdate(
            { clerkId: id },
            { $set: { email, displayName } },
            { upsert: true }
        )
    }

    if (event.type === 'user.deleted') {
        const { id } = event.data
        await connectDB()
        await UserModel.deleteOne({ clerkId: id })
    }

    return new Response('OK', { status: 200 })
}
