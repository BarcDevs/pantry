import { clerkSetup } from '@clerk/testing/playwright'

export default async () => {
    await clerkSetup()
}
