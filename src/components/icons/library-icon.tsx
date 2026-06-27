import type { IconProps } from '@/types/react'

export const LibraryIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <path
            d={'M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
        />
        <path
            d={'M9 8h6M9 11h6'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
            strokeLinecap={'round'}
        />
    </svg>
)
