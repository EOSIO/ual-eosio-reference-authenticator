# UAL EOSIO Reference Authenticator

This authenticator is meant to be used with [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library)

## Supported Environments

* The UAL EOSIO Reference Authenticator is currently supported on the Chrome desktop browser for use with the [EOSIO Reference Chrome Extension Authenticator App](https://github.com/EOSIO/eosio-reference-chrome-extension-authenticator-app).

## Getting Started

`yarn add @blockone/ual-eosio-reference-authenticator`

#### Dependencies

* All apps must follow the [Manifest Spec](https://github.com/EOSIO/manifest-spec)

* You must use one of the UAL renderers below.

  * React - `@blockone/ual-reactjs-renderer`

  * PlainJS - `@blockone/ual-plainjs-renderer`


#### Basic Usage with React

```javascript
import { EOSIOAuth } from '@blockone/ual-eosio-reference-authenticator'
import { UALProvider, withUAL } from '@blockone/ual-reactjs-renderer'

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
    
## Contributing

[Contributing Guide](https://github.com/EOSIO/ual-eosio-reference-authenticator/blob/develop/CONTRIBUTING.md)

[Code of Conduct](https://github.com/EOSIO/ual-eosio-reference-authenticator/blob/develop/CONTRIBUTING.md#conduct)

## License

[MIT](https://github.com/EOSIO/ual-eosio-reference-authenticator/blob/develop/LICENSE)
