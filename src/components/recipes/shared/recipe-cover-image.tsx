import { useState } from 'react'

import { cn } from '@/lib/utils'

type RecipeCoverImageProps = {
    imageUrl?: string
    emoji?: string
    emojiClassName: string
}

export const RecipeCoverImage = ({
    imageUrl,
    emoji,
    emojiClassName
}: RecipeCoverImageProps) => {
    const [failedUrl, setFailedUrl] = useState<string>()
    const hasImage = Boolean(imageUrl) && failedUrl !== imageUrl

    if (hasImage) return (
        <img
            src={imageUrl}
            alt={''}
            referrerPolicy={'no-referrer'}
            onError={() => setFailedUrl(imageUrl)}
            className={'absolute inset-0 size-full object-cover'}
        />
    )

    return (
        <div
            className={cn(
                'absolute inset-0 flex items-center justify-center',
                emojiClassName
            )}
        >
            {emoji ?? '🍽️'}
        </div>
    )
}
