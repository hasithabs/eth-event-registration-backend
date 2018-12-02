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
    port: process.env.PORT || 9002,
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
    SINGLE_TRANS_COST_PRIVATE_NET: 0.5,
    TRANSFER_AMOUNT: 1,
    THRESHOLD_AMOUNT: 0.0005,
    ACCOUNT_ADDRESS: '',
    ACCOUNT_PVT_KEY: '',
    ENCRYPT_PASSOWRD: 'k36K*5QVGS72'
  },
  NETWORK: {
    ACCESS_TOKEN: '',
    RINKEBY: {
      URL: 'https://rinkeby.infura.io/',
      ACCOUNT_ADDRESS: '',
      ACCOUNT_PVT_KEY: '',
      ADMIN_BASE_ADDRESS: ''
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
