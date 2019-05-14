
import { SignatureProviderInterface } from '@blockone/eosjs-signature-provider-interface'
import { Chain, SignTransactionResponse, UALErrorType, User } from 'universal-authenticator-library'
import * as bs58 from 'bs58'
import { Api, JsonRpc } from 'eosjs'
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from 'text-encoding'

const RIPEMD160 = require('eosjs/dist/ripemd').RIPEMD160.hash // tslint:disable-line

import { EOSIOAuthOptions } from './interfaces'
import { PlatformChecker } from './PlatformChecker'
import { UALEOSIOAuthError } from './UALEOSIOAuthError'

export class EOSIOAuthUser extends User {
  public signatureProvider: SignatureProviderInterface
  private api: Api | null
  private rpc: JsonRpc | null
  private textEncoder: TextEncoder | NodeTextEncoder
  private textDecoder: TextDecoder | NodeTextDecoder

  constructor(
    private chain: Chain,
    private accountName: string,
    private options?: EOSIOAuthOptions,
  ) {
    super()
    this.api = null
    this.rpc = null
    if (typeof(TextEncoder) !== 'undefined') {
      this.textEncoder = TextEncoder
      this.textDecoder = TextDecoder
    } else {
      this.textEncoder = NodeTextEncoder
      this.textDecoder = NodeTextDecoder
    }
  }

  public async init() {
    const platformChecker = new PlatformChecker(this.options)
    const SignatureProvider = platformChecker.getSupportedSignatureProvider()
    const declaredDomain = platformChecker.declaredDomain
    const returnUrl = await platformChecker.getReturnUrl()
    this.signatureProvider = new SignatureProvider({
      declaredDomain,
      returnUrl,
      options: this.options
    })
    const rpcEndpoint = this.chain.rpcEndpoints[0]
    const rpcEndpointString = this.buildRpcEndpoint(rpcEndpoint)
    this.rpc = new JsonRpc(rpcEndpointString)
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider: this.signatureProvider,
      textEncoder: new this.textEncoder(),
      textDecoder: new this.textDecoder(),
    })
  }

  public async signTransaction(
    transaction: any,
    { broadcast = true, blocksBehind = 3, expireSeconds = 30 }
  ): Promise<SignTransactionResponse> {
    try {
      this.throwIfNotInitialized()
      const completedTransaction = this.api && await this.api.transact(
        transaction,
        { broadcast, blocksBehind, expireSeconds }
      )
      return this.returnEosjsTransaction(broadcast, completedTransaction)
    } catch (e) {
      const message = 'Unable to sign transaction'
      const type = UALErrorType.Signing
      const cause = e
      throw new UALEOSIOAuthError(message, type, cause)
    }
  }

  public async signArbitrary(): Promise<string> {
    throw new UALEOSIOAuthError(
      'EOSIO Reference Authenticator does not currently support signArbitrary',
      UALErrorType.Unsupported,
      null)
  }

  public async verifyKeyOwnership(_: string): Promise<boolean> {
    throw new UALEOSIOAuthError(
      'EOSIO Reference Authenticator does not currently support verifyKeyOwnership',
      UALErrorType.Unsupported,
      null)
  }

  public async getAccountName(): Promise<string> {
    return this.accountName
  }

  public async getChainId(): Promise<string> {
    return this.chain.chainId
  }

  public async getKeys(): Promise<string[]> {
    const keys = await this.signatureProvider.getAvailableKeys()
    return keys
  }

  public async isAccountValid(): Promise<boolean> {
    try {
      const account = this.rpc && await this.rpc.get_account(this.accountName)
      const actualKeys = this.extractAccountKeys(account)
      const authorizationKeys = await this.getKeys()
      const legacyAuthorizationKeys = authorizationKeys.map((key) => this.convertToLegacyPubKey(key))

      return actualKeys.filter((key) => {
        return legacyAuthorizationKeys.indexOf(key) !== -1
      }).length > 0
    } catch (e) {
      const message = `Account validation failed for account ${this.accountName}.`
      const type = UALErrorType.Validation
      const cause = e
      throw new UALEOSIOAuthError(message, type, cause)
    }
  }

  private extractAccountKeys(account: any): string[] {
    const keySubsets = account.permissions.map((permission) => permission.required_auth.keys.map((key) => key.key))
    let keys = []
    for (const keySubset of keySubsets) {
      keys = keys.concat(keySubset)
    }
    return keys
  }

  private convertToLegacyPubKey(publicKey: string): string {
    const K1_PREFIX = 'PUB_K1_'

    if (publicKey.substr(0, K1_PREFIX.length) !== K1_PREFIX) {
      return publicKey
    }

    const nonPrefixPublicKey = publicKey.substr(K1_PREFIX.length)
    const bytesWithChecksum = bs58.decode(nonPrefixPublicKey)
    const bytes = bytesWithChecksum.slice(0, bytesWithChecksum.length - 4)
    const suffixBytes = Buffer.from(RIPEMD160(bytes)).slice(0, 4)
    const binaryPublicKey = Buffer.from([...bytes, ...suffixBytes])
    return `EOS${bs58.encode(binaryPublicKey)}`
  }

  private throwIfNotInitialized() {
    if (!this.api) {
      const message = 'Account Initialization failed.'
      const type = UALErrorType.Initialization
      const cause = new Error('Please initialize `EOSIOAuthUser` before using')
      throw new UALEOSIOAuthError(message, type, cause)
    }
  }
}
