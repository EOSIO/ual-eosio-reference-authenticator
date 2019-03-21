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

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.
