class Api {
 serializeTransaction() {
  return {a: "b"}
 }

 transact() {
  return {
    transaction_id: "abcd",
    processed: {
      receipt: {
        status: "executed",
      }
    }
  }
 }
}

class JsonRpc {
  get_account(name) {
    const eosio = {
      "account_name": "eosio",
      "permissions": [{
        "perm_name": "active",
        "parent": "owner",
        "required_auth": {
          "threshold": 1,
          "keys": [{
            "key": "2",
            "weight": 1
          }],
          "accounts": []
        }
      }, {
        "perm_name": "owner",
        "parent": "",
        "required_auth": {
          "threshold": 1,
          "keys": [{
            "key": "3",
            "weight": 1
          }],
          "accounts": []
        }
      }]
    }
    const mal = {
      "account_name": "mal",
      "permissions": [{
        "perm_name": "active",
        "parent": "owner",
        "required_auth": {
          "threshold": 1,
          "keys": [{
            "key": "testKey",
            "weight": 1
          }],
          "accounts": []
        }
      }, {
        "perm_name": "owner",
        "parent": "",
        "required_auth": {
          "threshold": 1,
          "keys": [{
            "key": "testKey",
            "weight": 1
          }],
          "accounts": []
        }
      }]
    }
    return name === "eosio" ? eosio : mal
  }
}

class JsSignatureProvider {
  getAvailableKeys() {
    return ["1", "3"]
  }

  sign(args) {
    return ["abcd"]
  }
}


module.exports = {
  Api,
  JsonRpc,
  JsSignatureProvider
}
