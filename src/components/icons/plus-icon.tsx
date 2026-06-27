import type { IconProps } from '@/types/react'

export const PlusIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <path
            d={'M12 5v14M5 12h14'}
            stroke={'currentColor'}
            strokeWidth={'1.8'}
            strokeLinecap={'round'}
        />
    </svg>
)
