/* eslint-disable no-unused-vars */
import path from 'path'
import _ from 'lodash'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    masterKey: requireProcessEnv('MASTER_KEY'),
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {
    mongo: {
      uri: process.env.MONGODB_URI + process.env.TEST_DB,
      options: {
        debug: false
      }
    }
  },
  development: {
    mongo: {
      uri: process.env.MONGODB_URI + process.env.DEV_DB,
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI + process.env.PRODUCTION_DB
    }
  }
}

const CONFIG_SETTINGS = {
  JWT: {
    SECRET_KEY: '',
    EXPIRATION: '30 days'
  },
  AWS: {
    S3: {
      SECRET_KEY: '',
      ACCESS_KEY: '',
      REGION: 'us-east-2'
    }
  },
  ACCOUNT_POOL: {
    SINGLE_TRANS_COST_TEST_NET: 0.0001,
    TRANSFER_AMOUNT: 1,
    THRESHOLD_AMOUNT: 0.0005,
    ACCOUNT_ADDRESS: '',
    ACCOUNT_PVT_KEY: '',
    ENCRYPT_PASSOWRD: 'k36K*5QVGS72'
  },
  NETWORK: {
    ACCESS_TOKEN: 'yH7Y0eceUrOYyngid10p',
    RINKEBY: {
      URL: 'https://rinkeby.infura.io/',
      ACCOUNT_ADDRESS: '0xb4Cd681d606B0A6AA034318740565A3F40dD6450',
      ACCOUNT_PVT_KEY: 'B57F9F2D19772BCF346795692F031C4D2C13B2D25FECB040000AC5617FB617FC',
      ADMIN_BASE_ADDRESS: '0x7938de7df1410b9b7cd7a205ccc7098faaf9438b'
    },
    ROPSTEN: {
      URL: 'https://ropsten.infura.io/',
      ACCOUNT_ADDRESS: '',
      ACCOUNT_PVT_KEY: '',
      ADMIN_BASE_ADDRESS: ''
    },
    KOVAN: {
      URL: 'https://kovan.infura.io/',
      ACCOUNT_ADDRESS: '',
      ACCOUNT_PVT_KEY: '',
      ADMIN_BASE_ADDRESS: ''
    },
    PRIVATE: {
      URL: '',
      ACCOUNT_ADDRESS: '',
      ACCOUNT_PVT_KEY: '',
      ADMIN_BASE_ADDRESS: ''
    }
  },
  CONTRACTS: {
    EVENT_TICKET: {
      ABI: [{
          "constant": true,
          "inputs": [],
          "name": "owner",
          "outputs": [{
            "name": "",
            "type": "address"
          }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getTicketDetails",
          "outputs": [{
              "name": "_id",
              "type": "uint256"
            },
            {
              "name": "_name",
              "type": "string"
            },
            {
              "name": "_email",
              "type": "string"
            },
            {
              "name": "_birthday",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{
              "name": "_owner",
              "type": "address"
            },
            {
              "name": "_id",
              "type": "uint256"
            },
            {
              "name": "_name",
              "type": "string"
            },
            {
              "name": "_email",
              "type": "string"
            },
            {
              "name": "_birthday",
              "type": "uint256"
            },
            {
              "name": "_eventAdminManageContract",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        }
      ],
      BYTECODE: "0x6060604052341561000f57600080fd5b60405161067938038061067983398101604052808051906020019091908051906020019091908051820191906020018051820191906020018051906020019091908051906020019091905050856000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508460028190555083600390805190602001906100b892919061013e565b5082600490805190602001906100cf92919061013e565b50816005819055506001600660006101000a81548160ff02191690831515021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050506101e3565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061017f57805160ff19168380011785556101ad565b828001600101855582156101ad579182015b828111156101ac578251825591602001919060010190610191565b5b5090506101ba91906101be565b5090565b6101e091905b808211156101dc5760008160009055506001016101c4565b5090565b90565b610487806101f26000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680638da5cb5b14610051578063fe14f1c7146100a6575b600080fd5b341561005c57600080fd5b6100646101ae565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100b157600080fd5b6100b96101d3565b604051808581526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b838110156101095780820151818401526020810190506100ee565b50505050905090810190601f1680156101365780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b8381101561016f578082015181840152602081019050610154565b50505050905090810190601f16801561019c5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006101dd610447565b6101e5610447565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660405180807f636865636b41646d696e4265666f726528616464726573732900000000000000815250601901905060405180910390207c01000000000000000000000000000000000000000000000000000000009004336040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303816000875af19250505090508015156102fc57600080fd5b600254945060038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103975780601f1061036c57610100808354040283529160200191610397565b820191906000526020600020905b81548152906001019060200180831161037a57829003601f168201915b5050505050935060048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104345780601f1061040957610100808354040283529160200191610434565b820191906000526020600020905b81548152906001019060200180831161041757829003601f168201915b5050505050925060055491505090919293565b6020604051908101604052806000815250905600a165627a7a72305820d0f88331cdf2092d84c60686e86a199676ee500320c188ed0420b06c9dcf3d8b0029",
    },
    ADMIN_MANAGEMENT: {
      ABI: [],
      BYTECODE: "",
    },
    GAS_LIMIT: 0,
    GAS_PRICE: 0
  },
  TRANSACTION_CONFIG: {
    MAX_RETRY_ATTEMPTS: 3
  }
}

module.exports = _.merge(config.all, config[config.all.env], CONFIG_SETTINGS)
// module.exports = {
//   CONFIG_SETTINGS: CONFIG_SETTINGS
// }
// module.exports = _.merge(config.all, config[config.all.env])
export default module.exports
