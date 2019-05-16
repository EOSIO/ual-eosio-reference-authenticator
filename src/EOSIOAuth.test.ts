import { Chain, User } from 'universal-authenticator-library'

import { EOSIOAuth } from './EOSIOAuth'
import { EOSIOAuthUser } from './EOSIOAuthUser'
import { PlatformChecker } from './PlatformChecker'
import { UALEOSIOAuthError } from './UALEOSIOAuthError'
import { EOSIOAuthOptions } from './interfaces'

describe('EOSIOAuth', () => {
  let chain: Chain
  let eosioAuth: EOSIOAuth
  let options: EOSIOAuthOptions

  beforeAll(() => {
    chain = {
      chainId: '',
      rpcEndpoints: [{
        protocol: '',
        host: '',
        port: 1234,
      }]
    }
    options = { appName: '', protocol: ''}
  })

  describe('should render', () => {
    beforeAll(() => {
      eosioAuth = new EOSIOAuth([chain], options)
    })

    it('true if authenticator has platform support', () => {
      PlatformChecker.prototype.isSupportedPlatform = jest.fn().mockReturnValue(true)
      expect(eosioAuth.shouldRender()).toEqual(true)
    })

    it('false if authenticator does not have platform support', () => {
      PlatformChecker.prototype.isSupportedPlatform = jest.fn().mockReturnValue(false)
      expect(eosioAuth.shouldRender()).toEqual(false)
    })
  })

  describe('initializes', () => {
    beforeEach(() => {
      eosioAuth = new EOSIOAuth([chain], options)
    })

    it('with a status of loading', () => {
      expect(eosioAuth.isLoading()).toEqual(false)
      eosioAuth.init()
      expect(eosioAuth.isLoading()).toEqual(true)
    })

    it('without error if authenticator is available', async () => {
      PlatformChecker.prototype.isSupportedPlatform = jest.fn().mockReturnValue(true)
      await eosioAuth.init()
      expect(eosioAuth.isErrored()).toEqual(false)
    })

    it('with an error if authenticator is unavailable', async () => {
      PlatformChecker.prototype.isSupportedPlatform = jest.fn().mockReturnValue(false)
      await eosioAuth.init()
      expect(eosioAuth.isErrored()).toEqual(true)
    })
  })

  describe('on login', () => {
    beforeEach(() => {
      eosioAuth = new EOSIOAuth([chain], options)
    })

    it('returns an array of users if account is valid', async () => {
      EOSIOAuthUser.prototype.isAccountValid = jest.fn().mockReturnValue(true)
      const users: User[] = await eosioAuth.login()
      expect(users.length).toEqual(1)
    })

    it('throws a login error if account is invalid', () => {
      EOSIOAuthUser.prototype.isAccountValid = jest.fn().mockReturnValue(false)
      expect(eosioAuth.login()).rejects.toThrow(UALEOSIOAuthError)
    })
  })

  describe('on logout', () => {
    let users
    beforeAll(() => {
      eosioAuth = new EOSIOAuth([chain], options)
      EOSIOAuthUser.prototype.isAccountValid = jest.fn().mockReturnValue(true)
    })

    beforeEach(async () => {
      users = await eosioAuth.login() 
    })

    it('calls cleanUp on the active user\'s signatureProvider', async () => {
      const spy = jest.spyOn(users[0].signatureProvider, 'cleanUp')
      await eosioAuth.logout()
      expect(spy).toHaveBeenCalled()
    })

    it('calls clearCachedKeys on the active user\'s signatureProvider', async () => {
      const spy = jest.spyOn(users[0].signatureProvider, 'clearCachedKeys')
      await eosioAuth.logout()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('on reset', () => {
    beforeEach(async () => {
      eosioAuth = new EOSIOAuth([chain], options)
      PlatformChecker.prototype.isSupportedPlatform = jest.fn().mockReturnValue(false)
      await eosioAuth.init()
    })

    it('clears any initialization error', () => {
      expect(eosioAuth.isErrored()).toEqual(true)
      eosioAuth.reset()
      expect(eosioAuth.isErrored()).toEqual(false)
    })

    it('calls init', () => {
      const spy = jest.spyOn(eosioAuth, 'init')
      eosioAuth.reset()
      expect(spy).toHaveBeenCalled()
    })
  })
})
