import signale from 'signale';
import _ from 'lodash';

import AccountPool, { schema } from './model';
import { toPromise } from '../response';
// import { sendEtherToAccount, getAccountBalance } from '../web3';
import CONFIG_SETTINGS from '../../config';

const addAccount = async (account) => {
  let [error, createdAcc] = await toPromise(AccountPool.create(account));
  if (error) {
    signale.error(`creating account... ${error}`);
    return false;
  } else {
    return createdAcc.view('ACCOUNT');
  }
}

const getNextAccount = async (network, privateNetID) => {
  var account;

  let [err, acc] = await toPromise(AccountPool.findOneAndUpdate({
    network: network,
    inUse: false,
    ether_amount: { $gt: CONFIG_SETTINGS.ACCOUNT_POOL.SINGLE_TRANS_COST_TEST_NET }
  },
  {
    inUse: true,
    lastUsed: new Date().toISOString()
  },
  {
    sort: { 'transactionCount': 1, 'lastUsed': 1 }
  }));

  if (err) {
    signale.error(`finding next account for ${network}... ${err}`);
    return false;
  } else if (acc != null) {
    account = acc;
  } else {
    signale.error(`no free accounts found for ${network}`);
    return false;
  }

  // if (account) {
  //   account.transactionCount++;
  //   let [error, updatedAcc] = await toPromise(AccountPool.findOneAndUpdate({ id: account.id }, {
  //     transactionCount: account.transactionCount,
  //     inUse: true,
  //     lastUsed: new Date().toISOString()
  //   }));

  //   if (error) {
  //     signale.error(`updating account... ${error}`);
  //     return false;
  //   } else {
  //     return updatedAcc.view('ACCOUNT');
  //   }
  // }
}

const returnAccount = async (account, usedAmount) => {
  let [error, updatedAcc] = await toPromise(AccountPool.findOneAndUpdate({ id: account.id },
  {
    inUse: false,
    $inc: {
      'ether_amount': -(usedAmount),
      'transactionCount': ++account.transactionCount
    }
  }));
  if (error) {
    signale.error(`returning account... ${error}`);
    return false;
  } else {
    return true;
  }
}

const getEthMainAccountPvtKey = async (_network, _accountSelection, _electionId) => {
  if (_accountSelection == 1) {
    return _.get(CONFIG_SETTINGS, `NETWORK.${_network.toUpperCase()}.ACCOUNT_PVT_KEY`);
  } else {
    let [err, accountObj] = await toPromise(AccountPool.findOne({ election_id: _electionId }));
    return accountObj.privateKey;
  }
}

module.exports = {
  addAccount,
  getNextAccount,
  returnAccount,
  // checkBalances,
  // updateBalance,
  // getEthMainAccountPvtKey
}

