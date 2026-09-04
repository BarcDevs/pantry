import { dayInMs } from '@/constants/time'

export type ExpiryTone = 'none' | 'green' | 'amber' | 'red'

export type ExpiryStatus = {
    tone: ExpiryTone
    daysLeft: number | null
}

const JERUSALEM_TIME_ZONE = 'Asia/Jerusalem'
export const EXPIRY_SOON_THRESHOLD_DAYS = 7

// Product is Israel-market-only, single timezone - anchor "today" and the
// target date to Asia/Jerusalem's calendar day, not the runtime's local time,
// so days-left doesn't shift for users/servers outside that timezone.
const toJerusalemDateOnly = (date: Date): Date => {
    const isoDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: JERUSALEM_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date)
    return new Date(`${isoDate}T00:00:00`)
}

export const getExpiryStatus = (expiryDate: Date | undefined): ExpiryStatus => {
    if (!expiryDate) return { tone: 'none', daysLeft: null }

    const today = toJerusalemDateOnly(new Date())
    const target = toJerusalemDateOnly(new Date(expiryDate))

    const daysLeft = Math.round((target.getTime() - today.getTime()) / dayInMs)

    if (daysLeft <= 0) return { tone: 'red', daysLeft }
    if (daysLeft <= EXPIRY_SOON_THRESHOLD_DAYS) return { tone: 'amber', daysLeft }
    return { tone: 'green', daysLeft }
}
