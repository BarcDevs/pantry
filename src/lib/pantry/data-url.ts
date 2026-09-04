export const extractBase64FromDataUrl = (dataUrl: string): string => (
    dataUrl.split(',')[1] ?? ''
)
