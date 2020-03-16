import {
  SignatureProvider as IOSSignatureProvider
} from 'eosjs-ios-browser-signature-provider-interface'
import {
  packEnvelope,
  SignatureProviderEnvelope,
  SignatureProviderResponseEnvelope,
  unpackEnvelope,
} from 'eosjs-signature-provider-interface'
import {
  SignatureProvider as ChromeSignatureProvider
} from 'eosjs-window-message-signature-provider-interface'
import uuid from 'uuid'

import {
  EOSIOAuthOptions,
  PendingRequest,
  SignatureProviderInterfaceClass,
} from './interfaces'

declare const window: any

enum Platform {
  IOS = 'ios',
  DESKTOP_CHROME = 'desktopChrome',
  NOT_SUPPORTED = 'notSupported'
}

export class PlatformChecker {
  private static MESSAGE_WAIT_TIMEOUT = 1000
  private pendingRequest: PendingRequest

  constructor(public options?: EOSIOAuthOptions) {
    this.options = options
  }

  public get declaredDomain(): string {
    const browserUrl = window.location.href
    const arr = browserUrl.split('/')
    const declaredDomain = `${arr[0]}//${arr[2]}`
    return declaredDomain
  }

  private get platform(): Platform {
    const isIOS = this.userAgent.includes('iPhone') || this.userAgent.includes('iPad')
    const isEmbeddedIOS = (window.webkit && window.webkit.messageHandlers)
    if (isIOS && !isEmbeddedIOS) {
      return Platform.IOS
    }

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.userAgent)
    const isDesktopChrome = this.userAgent.includes('Chrome') && !isMobile
    if (isDesktopChrome) {
      return Platform.DESKTOP_CHROME
    }

    return Platform.NOT_SUPPORTED
  }

  private get userAgent(): string {
    if ('userAgent' in window.navigator) {
      return window.navigator.userAgent
    } else {
      return window.navigator.product.toLowerCase()
    }
  }

  public async getReturnUrl(): Promise<string> {
    return window.location.href
  }

  public isSupportedPlatform(): boolean {
    return this.platform !== Platform.NOT_SUPPORTED
  }

  public async isAvailable(): Promise<boolean> {
    if (this.platform === Platform.DESKTOP_CHROME) {
      return await this.isExtensionInstalled()
    }

    return this.isSupportedPlatform()
  }

  public getSupportedSignatureProvider(): SignatureProviderInterfaceClass {
    switch (this.platform) {
      case Platform.IOS:
        return IOSSignatureProvider
      case Platform.DESKTOP_CHROME:
        return ChromeSignatureProvider
      default:
        return IOSSignatureProvider
    }
  }

  public async isExtensionInstalled(): Promise<boolean> {
    window.addEventListener('message', this.onWindowMessage.bind(this))

    const promise = new Promise<boolean>((resolve, reject) => {
      this.pendingRequest = { resolve, reject }
    })

    const request = await this.createInstallationCheckRequest()
    const requestEnvelope = packEnvelope(request)
    window.postMessage(requestEnvelope, this.declaredDomain)
    setTimeout(
      this.installationCheckResponseNotReceived.bind(this),
      PlatformChecker.MESSAGE_WAIT_TIMEOUT
    )

    return promise
  }

  private async createInstallationCheckRequest(): Promise<SignatureProviderEnvelope> {
    const returnUrl = await this.getReturnUrl()
    return  {
      version: '0.0.1',
      id: uuid(),
      declaredDomain: this.declaredDomain,
      returnUrl,
      request: {
        installationCheck: {}
      },
    } as SignatureProviderEnvelope
  }

  private installationCheckResponseNotReceived(): void {
    if (this.pendingRequest) {
      this.pendingRequest.resolve(false)
      this.pendingRequest = null
    }
  }

  private installationCheckResponseReceived(): void {
    if (this.pendingRequest) {
      this.pendingRequest.resolve(true)
      this.pendingRequest = null
    }
  }

  private onWindowMessage(event: MessageEvent): void {
    const packedResponseEnvelope = event.data as string
    try {
      const responseEnvelope: SignatureProviderResponseEnvelope = unpackEnvelope(packedResponseEnvelope)
      if ('installationCheck' in responseEnvelope.response) {
        this.installationCheckResponseReceived()
      }
    } catch (e) {
      // Data coming over message event was from some other source; ignore it
    }
  }
}
