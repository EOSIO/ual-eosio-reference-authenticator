import { PlatformChecker } from './PlatformChecker'

declare var window: any

//Make userAgent mutable for testing
Object.defineProperty(window.navigator, 'userAgent', ((_value) => {
  return {
    get: () => _value,
    set: (v) => {
        _value = v;
    }
  };
})(window.navigator.userAgent))

describe('PlatformChecker', () => {
  describe('isSupportedPlatform', () => {
    beforeEach(() => {
      window.navigator.userAgent = ''
    })

    it('returns true for iPhone', () => {
      window.navigator.userAgent = 'iPhone'
      const platformChecker = new PlatformChecker()
      expect(platformChecker.isSupportedPlatform()).toEqual(true)
    })

    it('returns true for iPad', () => {
      window.navigator.userAgent = 'iPad'
      const platformChecker = new PlatformChecker()
      expect(platformChecker.isSupportedPlatform()).toEqual(true)
    })

    it('returns true for react native', () => {
      window.navigator.userAgent = 'reactnative'
      const platformChecker = new PlatformChecker()
      expect(platformChecker.isSupportedPlatform()).toEqual(true)
    })

    it('returns false for android', () => {
      window.navigator.userAgent = 'Android'
      const platformChecker = new PlatformChecker()
      expect(platformChecker.isSupportedPlatform()).toEqual(false)
    })

    it('returns false for embedded ios browser', () => {
      (window as any).webkit = {
        messageHandlers: {}
      }
      window.navigator.userAgent = 'iPhone'
      const platformChecker = new PlatformChecker()
      expect(platformChecker.isSupportedPlatform()).toEqual(false)
    })
  })
})
