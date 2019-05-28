import {
  ErrorResponse,
  SignatureProviderInterface,
  SignatureProviderInterfaceParams,
  SecurityExclusions,
} from 'eosjs-signature-provider-interface'

export const Name = 'EOSIO Auth'

export type SignatureProviderInterfaceClass =
  new (params: SignatureProviderInterfaceParams) => SignatureProviderInterface

export interface PendingRequest {
  resolve: (value?: boolean | PromiseLike<boolean>) => void
  reject: (reason?: ErrorResponse) => void
}

export interface EOSIOAuthOptions {
  Linking?: any
  declaredDomain?: string
  securityExclusions?: SecurityExclusions
  protocol?: string
  appName: string
}
