import { EOSIOAuthUser } from './EOSIOAuthUser'

describe('EOSIOAuthUser', () => {
  it('signs transactions', async () => {
    const chain = {
      chainId: '',
      rpcEndpoints: [{
        protocol: '',
        host: '',
        port: 1234,
      }]
    }
    const eosioAuthUser = new EOSIOAuthUser(chain, '', { appName: '', protocol: ''})
    await eosioAuthUser.init()

    expect(await eosioAuthUser.signTransaction({}, {broadcast: true})).toEqual({
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
