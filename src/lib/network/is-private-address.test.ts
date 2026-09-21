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
        '0.0.0.0',
        '224.0.0.1',
        '239.255.255.255',
        '240.0.0.1',
        '255.255.255.255',
        '192.0.0.8',
        '192.0.2.10',
        '198.18.0.1',
        '198.19.255.255',
        '198.51.100.7',
        '203.0.113.99'
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
        '192.169.0.0',
        '223.255.255.255',
        '192.0.1.1',
        '192.0.3.1',
        '198.17.255.255',
        '198.20.0.0',
        '198.51.99.1',
        '198.51.101.1',
        '203.0.112.1',
        '203.0.114.1'
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
        'fe90::1',
        'febf::1',
        'ff02::1',
        '2001:db8::1',
        '::ffff:7f00:1',
        '::ffff:a00:1',
        '::ffff:c0a8:101',
        '::ffff:a9fe:a9fe'
    ])('treats IPv6 %s as private', (address) => {
        expect(isPrivateAddress(address)).toBe(true)
    })

    it.each([
        '2606:4700::1111',
        '2001:4860:4860::8888',
        '::ffff:8.8.8.8',
        '::ffff:808:808',
        '2001:db9::1'
    ])('treats IPv6 %s as public', (address) => {
        expect(isPrivateAddress(address)).toBe(false)
    })
})
