class VaultSignatureProvider {
  constructor() {}

  getAvailableKeys() {
    return ["1", "3"]
  }

  sign(args) {
    return ["abcd"]
  }
}

module.exports = VaultSignatureProvider

