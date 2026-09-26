import { authTexts } from '@/constants/texts/auth'

type ResettingPasswordForSubtitleProps = {
    email: string
}

export const ResettingPasswordForSubtitle = ({ email }: ResettingPasswordForSubtitleProps) => (
    <>
        <span>{authTexts.resettingPasswordForPrefix}</span>
        <bdi dir={'ltr'}>{email}</bdi>
    </>
)
