import { Chain } from 'universal-authenticator-library'
import { Api, JsonRpc } from 'eosjs'

import { EOSIOAuthUser } from './EOSIOAuthUser'
import { PlatformChecker } from './PlatformChecker'

let signatureProviderMock: jest.Mock
let getReturnUrlMock: jest.Mock
let getSupportedSignatureProviderMock: jest.Mock

jest.mock('./PlatformChecker', () => ({
  PlatformChecker: jest.fn().mockImplementation(() => ({
    declaredDomain: 'testDeclaredDomain',
    getSupportedSignatureProvider: getSupportedSignatureProviderMock,
    getReturnUrl: getReturnUrlMock
  }))
}))

let transactMock: jest.Mock

jest.mock('eosjs', () => ({
  Api: jest.fn().mockImplementation(() => ({
    transact: transactMock
  })),
  JsonRpc: jest.fn()
}))

describe('EOSIOAuthUser', () => {
  let chain: Chain
  let eosioAuthUser: EOSIOAuthUser

  beforeEach(() => {
    signatureProviderMock = jest.fn()
    getReturnUrlMock = jest.fn().mockReturnValue('testReturnURL')
    getSupportedSignatureProviderMock = jest.fn().mockReturnValue(signatureProviderMock)

    chain = {
      chainId: 'testChainId',
      rpcEndpoints: [{
        protocol: 'https',
        host: 'testHost',
        port: 1234,
      }]
    }

    eosioAuthUser = new EOSIOAuthUser(chain, 'testAccount')
  })

  describe('init', () => {
    beforeEach(async () => {
      await eosioAuthUser.init()
    })

    it('creates a new PlatformChecker', () => {
      expect(PlatformChecker).toHaveBeenCalled()
    })

    it('gets the returnUrl from PlatformChecker', () => {
      expect(getReturnUrlMock).toHaveBeenCalled()
    })

    it('gets the SignatureProvider Class from PlatformChecker ', () => {
      expect(getSupportedSignatureProviderMock).toHaveBeenCalled()
    })

    it('creates a new SignatureProvider', () => {
      expect(signatureProviderMock).toHaveBeenCalledWith({
        declaredDomain: 'testDeclaredDomain',
        returnUrl: 'testReturnURL'
      })
    })

    it('creates a new SignatureProvider with options when given', async () => {
      const options = {
        appName: 'testAppName'
      }
      const eosioAuthUser = new EOSIOAuthUser(chain, 'testAccount', options)
      await eosioAuthUser.init()

      expect(signatureProviderMock).toHaveBeenCalledWith({
        declaredDomain: 'testDeclaredDomain',
        returnUrl: 'testReturnURL',
        options,
      })
    })

    it('creates a new SignatureProvider with security exclusions when given', async () => {
      const options = {
        appName: 'testAppName',
        securityExclusions: {
          addAssertToTransactions: false 
        }
      }
      const eosioAuthUser = new EOSIOAuthUser(chain, 'testAccount', options)
      await eosioAuthUser.init()

      expect(signatureProviderMock).toHaveBeenCalledWith({
        declaredDomain: 'testDeclaredDomain',
        returnUrl: 'testReturnURL',
        securityExclusions: options.securityExclusions,
        options,
      })
    })

    it('creates a new eosjs JsonRpc with the correct rpc endpoint', () => {
      expect(JsonRpc).toHaveBeenCalledWith('https://testHost:1234')
    })

    it('creates a new eosjs Api', () => {
      expect(Api).toHaveBeenCalled()
    })
  })

  describe(('signTransaction'), () => {
    beforeEach(() => {
      transactMock = jest.fn().mockReturnValue({
        wasBroadcast: true,
        transactionId: 'abcd',
        status: 'executed',
        transaction: {
          processed: {
            receipt: {
              status: 'executed'
            }
          },
          transaction_id: 'abcd',
        }
      })
    })

    it('signs transactions', async () => {
      await eosioAuthUser.init()
      const transactionResponse = await eosioAuthUser.signTransaction({}, {broadcast: true})
  
      expect(transactionResponse).toEqual({
        wasBroadcast: true,
        transactionId: 'abcd',
        status: 'executed',
        transaction: {
          processed: {
            receipt: {
              status: 'executed'
            }
          },
          transaction_id: 'abcd',
        },
      })
    })
  })
})
