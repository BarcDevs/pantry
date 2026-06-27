import type { IconProps } from '@/types/react'

export const CameraIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <rect
            x={'3'}
            y={'6'}
            width={'18'}
            height={'14'}
            rx={'2.5'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
        />
        <circle
            cx={'12'}
            cy={'13'}
            r={'3.2'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
        />
        <path
            d={'M8 6l1.2-2h5.6L16 6'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
            strokeLinejoin={'round'}
        />
    </svg>
)
