import { isPrivateAddress } from './is-private-address'

describe('isPrivateAddress', () => {
    it.each([
        '127.0.0.1',
        '127.255.255.254',
        '10.0.0.1',
        '10.255.255.255',
        '172.16.0.0',
        '172.31.255.255',
        '192.168.0.1',
        '192.168.255.255',
        '169.254.169.254',
        '100.64.0.1',
        '100.127.255.255',
        '0.0.0.0'
    ])('treats IPv4 %s as private', (address) => {
        expect(isPrivateAddress(address)).toBe(true)
    })

    it.each([
        '8.8.8.8',
        '1.1.1.1',
        '172.15.255.255',
        '172.32.0.0',
        '100.63.255.255',
        '100.128.0.0',
        '192.167.255.255',
        '192.169.0.0'
    ])('treats IPv4 %s as public', (address) => {
        expect(isPrivateAddress(address)).toBe(false)
    })

    it.each([
        '::1',
        '::',
        '::ffff:127.0.0.1',
        '::ffff:10.1.2.3',
        'fc00::',
        'fd12::',
        'fe80::1',
        'ff02::1'
    ])('treats IPv6 %s as private', (address) => {
        expect(isPrivateAddress(address)).toBe(true)
    })

    it.each([
        '2606:4700::1111',
        '2001:4860:4860::8888',
        '::ffff:8.8.8.8'
    ])('treats IPv6 %s as public', (address) => {
        expect(isPrivateAddress(address)).toBe(false)
    })
})
