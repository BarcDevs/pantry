import type { IconProps } from '@/types/react'

export const HistoryIcon = ({ size = 21 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 24 24'}
        fill={'none'}
    >
        <circle
            cx={'12'}
            cy={'12'}
            r={'8.5'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
        />
        <path
            d={'M12 7.5V12l3 2'}
            stroke={'currentColor'}
            strokeWidth={'1.7'}
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
        />
    </svg>
)
