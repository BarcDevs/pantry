import type { IconProps } from '@/types/react'

export const HomeIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <path
            d={'M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8Z'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
            strokeLinejoin={'round'}
        />
    </svg>
)
