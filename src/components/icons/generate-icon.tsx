import type { IconProps } from '@/types/react'

export const GenerateIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <path
            d={'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
            strokeLinejoin={'round'}
        />
    </svg>
)
