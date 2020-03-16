import {
  Authenticator,
  ButtonStyle,
  Chain,
  UALError,
  UALErrorType,
  User
} from 'universal-authenticator-library'

import { EOSIOAuthUser } from './EOSIOAuthUser'
import { eosioLogo } from './eosioLogo'
import { EOSIOAuthOptions, Name } from './interfaces'
import { PlatformChecker } from './PlatformChecker'
import { UALEOSIOAuthError } from './UALEOSIOAuthError'

export class EOSIOAuth extends Authenticator {
  private users: EOSIOAuthUser[] = []
  private eosioAuthIsLoading: boolean = false
  private initError: UALError | null = null
  private platformChecker: PlatformChecker = null
  public options?: EOSIOAuthOptions

  /**
   * EOSIO Reference Authenticator Constructor
   *
   * @param chains
   * @param options
   */
  constructor(chains: Chain[], options?: EOSIOAuthOptions) {
    super(chains, options)
    this.platformChecker = new PlatformChecker(this.options)
  }

  /**
   * Checks to see if EOSIO Reference Authenticator is available in the current environment.
   * Currently, the platformChecker only determines the presence
   * of the EOSIO Reference Chrome Extension Authenticator App.
   */
  public async init(): Promise<void> {
    this.eosioAuthIsLoading = true
    try {
      const isAvailable = await this.platformChecker.isAvailable()
      if (!isAvailable) {
        throw new Error('Unable to detect authenticator')
      }
    } catch (e) {
      const message = 'Error occurred during initialization'
      const type = UALErrorType.Initialization
      const cause = e
      this.initError = new UALEOSIOAuthError(message, type, cause)
    } finally {
      this.eosioAuthIsLoading = false
    }
  }

  public reset(): void {
    this.initError = null
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.init()
  }

  /**
   * EOSIO Reference Authenticator will render on mobile and desktop environments
   */
  public shouldRender(): boolean {
    return this.platformChecker.isSupportedPlatform()
  }

  public shouldAutoLogin(): boolean {
    return false // EOSIO Reference Authenticator does not support autoLogin
  }

  public async shouldRequestAccountName(): Promise<boolean> {
    return true
  }

  public async login(accountName?: string): Promise<User[]> {
    for (const chain of this.chains) {
      const user = await new EOSIOAuthUser(chain, accountName || '', this.options)
      await user.init()
      const isValid = await user.isAccountValid()
      if (!isValid) {
        const message = `Error logging into account "${accountName}"`
        const type = UALErrorType.Login
        const cause = null
        throw new UALEOSIOAuthError(message, type, cause)
      }
      this.users.push(user)
    }

    return this.users
  }

  /**
   * Calls logout on EOSIO Reference Authenticator. This clears any key caching applied by the signature provider.
   * Throws a Logout Error if unsuccessful.
   */
  public async logout(): Promise<void> {
    try {
      for (const user of this.users) {
        user.signatureProvider.cleanUp()
        user.signatureProvider.clearCachedKeys()
      }
      this.users = []
    } catch (e) {
      const message = 'Error logging out'
      const type = UALErrorType.Logout
      const cause = e
      throw new UALEOSIOAuthError(message, type, cause)
    }
  }

  public getStyle(): ButtonStyle {
    return {
      icon: eosioLogo,
      text: Name,
      textColor: 'white',
      background: '#1A3270',
    }
  }

  public isLoading(): boolean {
    return this.eosioAuthIsLoading
  }

  public isErrored(): boolean {
    return !!this.initError
  }

  public getError(): UALError | null {
    return this.initError
  }

  public getOnboardingLink(): string {
    return 'https://github.com/EOSIO/ual-eosio-reference-authenticator'
  }

  public requiresGetKeyConfirmation(): boolean {
    return false
  }
}
