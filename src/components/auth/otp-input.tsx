import type { Ref } from 'react'

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp'

import { OTP_LENGTH } from '@/constants/auth'

type OtpInputProps = {
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    name?: string
    ref?: Ref<HTMLInputElement>
}

export const OtpInput = ({
    ...props
}: OtpInputProps) => (
    <div dir={'ltr'}>
        <InputOTP
            maxLength={OTP_LENGTH}
            containerClassName={'justify-center'}
            {...props}
        >
            <InputOTPGroup>
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                    <InputOTPSlot
                        key={index}
                        index={index}
                    />
                ))}
            </InputOTPGroup>
        </InputOTP>
    </div>
)
