import type { Ref } from 'react'

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp'

type OtpInputProps = {
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    name?: string
    ref?: Ref<HTMLInputElement>
}

const OTP_LENGTH = 6

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
