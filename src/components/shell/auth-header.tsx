import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton
} from '@clerk/nextjs'

const AuthHeader = () => (
    <header className={'flex items-center justify-end gap-2 px-4 py-3 border-b border-border'}>
        <Show when={'signed-out'}>
            <SignInButton/>
            <SignUpButton/>
        </Show>
        <Show when={'signed-in'}>
            <UserButton/>
        </Show>
    </header>
)

export { AuthHeader }
