import { extractBase64FromDataUrl } from '@/lib/pantry/data-url'

export const fileToBase64 = (file: Blob): Promise<string> => (
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            resolve(extractBase64FromDataUrl(result))
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
)
