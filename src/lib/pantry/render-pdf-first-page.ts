import { extractBase64FromDataUrl } from '@/lib/pantry/data-url'

export const renderPdfFirstPageToBase64 = async (
    file: Blob
): Promise<string> => {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
    ).toString()

    const buffer = await file.arrayBuffer()
    const doc = await pdfjs.getDocument({ data: buffer }).promise
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: 2 })

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas context unavailable')

    await page.render({
        canvasContext: context,
        viewport,
        canvas
    }).promise

    const dataUrl = canvas.toDataURL('image/png')
    return extractBase64FromDataUrl(dataUrl)
}
