import {
    format,
    formatDistanceToNow,
    isToday,
    isYesterday
} from 'date-fns'
import { he } from 'date-fns/locale'

export const formatCookedAt = (cookedAt: Date): string => {
    const time = format(cookedAt, 'HH:mm')
    if (isToday(cookedAt)) return `היום · ${time}`
    if (isYesterday(cookedAt)) return `אתמול · ${time}`
    return formatDistanceToNow(
        cookedAt,
        { locale: he, addSuffix: true }
    )
}
