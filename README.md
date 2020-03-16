# UAL for EOSIO Reference Authenticator

This authenticator is meant to be used with the [EOSIO Reference Authenticator Apps](#supported-environments) and the [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library).

![EOSIO Labs](https://img.shields.io/badge/EOSIO-Labs-5cb3ff.svg)

## About EOSIO Labs

EOSIO Labs repositories are experimental.  Developers in the community are encouraged to use EOSIO Labs repositories as the basis for code and concepts to incorporate into their applications. Community members are also welcome to contribute and further develop these repositories. Since these repositories are not supported by Block.one, we may not provide responses to issue reports, pull requests, updates to functionality, or other requests from the community, and we encourage the community to take responsibility for these.

## Getting Started

`yarn add ual-eosio-reference-authenticator`

#### Dependencies

* All apps must follow the [Manifest Specification](https://github.com/EOSIO/manifest-spec)

* You must use one of the UAL renderers below.

  * React - `ual-reactjs-renderer`

  * PlainJS - `ual-plainjs-renderer`


#### Basic Usage with React

```javascript
import { EOSIOAuth } from 'ual-eosio-reference-authenticator'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

const exampleNet = {
  chainId: '',
  rpcEndpoints: [{
    protocol: '',
    host: '',
    port: '',
  }]
}

const App = (props) => <div>{JSON.stringify(props.ual)}</div>
const AppWithUAL = withUAL(App)

const eosioAuth = new EOSIOAuth([exampleNet], { appName: 'Example App' })

<UALProvider chains={[exampleNet]} authenticators={[eosioAuth]}>
  <AppWithUAL />
</UALProvider>
```

## Supported Environments

The UAL EOSIO Reference Authenticator is currently supported on the following environments and their required [options](https://github.com/EOSIO/ual-eosio-reference-authenticator/blob/master/src/interfaces.ts#L18) are listed below:

* Chrome Desktop Browser - [EOSIO Reference Chrome Extension Authenticator App](https://github.com/EOSIO/eosio-reference-chrome-extension-authenticator-app)
  * Required option: `appName`
  * Optional option: `securityExclusions`
  ```javascript
  const securityExclusions = {
    addAssertToTransactions: false
  }
  const eosioAuth = new EOSIOAuth([exampleNet], { appName: 'Example App', securityExclusions })
  ```
* iOS - [EOSIO Reference iOS Authenticator App](https://github.com/EOSIO/eosio-reference-ios-authenticator-app)
  * Required options: `appName`, `protocol`
  * Optional option: `securityExclusions`
  ```javascript
  const securityExclusions = {
    addAssertToTransactions: false
  }
  const eosioAuth = new EOSIOAuth([exampleNet], { appName: 'Example App', protocol: 'eosio', securityExclusions })
  ```

## Contributing

[Contributing Guide](./CONTRIBUTING.md)

[Code of Conduct](./CONTRIBUTING.md#conduct)

## License

[MIT](./LICENSE)

## Important

See [LICENSE](./LICENSE) for copyright and license terms.

All repositories and other materials are provided subject to the terms of this [IMPORTANT](./IMPORTANT.md) notice and you must familiarize yourself with its terms.  The notice contains important information, limitations and restrictions relating to our software, publications, trademarks, third-party resources, and forward-looking statements.  By accessing any of our repositories and other materials, you accept and agree to the terms of the notice.
