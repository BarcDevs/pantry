import { createGoogleGenerativeAI } from '@ai-sdk/google'

import env from '@/config/env'

const google = createGoogleGenerativeAI({
    apiKey: env.geminiApiKey
})

export const AI_MODEL_ID = 'gemini-2.0-flash'

export const aiModel = google(AI_MODEL_ID)
