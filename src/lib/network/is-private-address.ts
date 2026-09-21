const ipToInt = (ipv4: string): number => {
    const parts = ipv4.split('.').map(Number)
    return parts.reduce((acc, part) => (acc << 8) + part, 0) >>> 0
}

const privateIpv4Ranges: Array<[number, number]> = [
    [ipToInt('0.0.0.0'), ipToInt('0.255.255.255')],
    [ipToInt('10.0.0.0'), ipToInt('10.255.255.255')],
    [ipToInt('100.64.0.0'), ipToInt('100.127.255.255')],
    [ipToInt('127.0.0.0'), ipToInt('127.255.255.255')],
    [ipToInt('169.254.0.0'), ipToInt('169.254.255.255')],
    [ipToInt('172.16.0.0'), ipToInt('172.31.255.255')],
    [ipToInt('192.0.0.0'), ipToInt('192.0.0.255')],
    [ipToInt('192.0.2.0'), ipToInt('192.0.2.255')],
    [ipToInt('192.168.0.0'), ipToInt('192.168.255.255')],
    [ipToInt('198.18.0.0'), ipToInt('198.19.255.255')],
    [ipToInt('198.51.100.0'), ipToInt('198.51.100.255')],
    [ipToInt('203.0.113.0'), ipToInt('203.0.113.255')],
    [ipToInt('224.0.0.0'), ipToInt('255.255.255.255')]
]

const isPrivateIpv4 = (address: string): boolean => {
    const value = ipToInt(address)
    return privateIpv4Ranges.some(
        ([start, end]) => value >= start && value <= end
    )
}

const mappedHexPattern = /^::ffff:([\da-f]{1,4}):([\da-f]{1,4})$/

const hexPairToIpv4 = (high: string, low: string): string => {
    const highValue = parseInt(high, 16)
    const lowValue = parseInt(low, 16)
    return [
        highValue >> 8,
        highValue & 255,
        lowValue >> 8,
        lowValue & 255
    ].join('.')
}

const isPrivateIpv6 = (address: string): boolean => {
    const normalized = address.toLowerCase()
    if (normalized === '::1' || normalized === '::') return true
    const mappedHex = normalized.match(mappedHexPattern)
    if (mappedHex) {
        return isPrivateIpv4(hexPairToIpv4(mappedHex[1], mappedHex[2]))
    }
    if (normalized.startsWith('::ffff:')) {
        return isPrivateIpv4(normalized.replace('::ffff:', ''))
    }
    return (
        normalized.startsWith('fc')
        || normalized.startsWith('fd')
        || /^fe[89ab]/.test(normalized)
        || normalized.startsWith('2001:db8:')
        || normalized.startsWith('64:ff9b:')
        || normalized.startsWith('2002:')
        || normalized.startsWith('2001:0:')
        || normalized.startsWith('ff')
    )
}

export const isPrivateAddress = (address: string): boolean =>
    address.includes(':') ? isPrivateIpv6(address) : isPrivateIpv4(address)
