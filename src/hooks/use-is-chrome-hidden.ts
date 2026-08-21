'use client'

import { usePathname } from 'next/navigation'

const COOK_ROUTE_SUFFIX = '/cook'

export const useIsChromeHidden = () => {
    const pathname = usePathname()

    return pathname.endsWith(COOK_ROUTE_SUFFIX)
}
