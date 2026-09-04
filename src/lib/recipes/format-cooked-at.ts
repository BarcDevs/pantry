import {
    format,
    isToday,
    isYesterday
} from 'date-fns'
import { he } from 'date-fns/locale'

export const formatCookedAt = (cookedAt: Date): string => {
    const time = format(cookedAt, 'HH:mm')
    if (isToday(cookedAt)) return `היום · ${time}`
    if (isYesterday(cookedAt)) return `אתמול · ${time}`
    const dayLabel = format(
        cookedAt,
        'd בMMMM',
        { locale: he }
    )
    return `${dayLabel} · ${time}`
}
