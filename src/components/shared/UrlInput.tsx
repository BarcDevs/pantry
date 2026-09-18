import type { ComponentProps } from 'react'

import { LtrInput } from '@/components/shared/LtrInput'

import { isUrlInputInvalid } from '@/lib/network/parse-url-input'

import { commonTexts } from '@/constants/texts/common'

type UrlInputProps = Omit<ComponentProps<typeof LtrInput>, 'value'> & {
    value: string
}

export const UrlInput = ({
    value,
    ...props
}: UrlInputProps) => {
    const isInvalid = isUrlInputInvalid(value)

    return (
        <div className={'flex flex-col gap-1.5'}>
            <LtrInput
                {...props}
                type={'url'}
                value={value}
                aria-invalid={isInvalid}
            />
            {isInvalid && (
                <span className={'text-label text-status-red-fg'}>
                    {commonTexts.urlInvalid}
                </span>
            )}
        </div>
    )
}
