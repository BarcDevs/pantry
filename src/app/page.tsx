import { AuthHeader } from '@/components/shell/auth-header'

import appConfig from '@/config/app'

const Home = () => (
    <>
        <AuthHeader/>
        <main className={'flex flex-1 items-center justify-center'}>
            <p className={'text-heading font-display font-bold text-ink'}>
                {appConfig.name}
            </p>
        </main>
    </>
)

export default Home
