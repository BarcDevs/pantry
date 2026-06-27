import type { IconProps } from '@/types/react'

export const ProfileIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <circle
            cx={'12'}
            cy={'8'}
            r={'3.6'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
        />
        <path
            d={'M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
            strokeLinecap={'round'}
        />
    </svg>
)
