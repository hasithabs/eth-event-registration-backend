import signale from 'signale';
import _ from 'lodash';

import AccountPool, { schema } from './model';
import { toPromise } from '../response';
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

const getNextAccount = async () => {
  let [err, acc] = await toPromise(AccountPool.findOneAndUpdate({
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
    signale.error(`finding next account... ${err}`);
    throw new Error(`error finding next account... ${err}`);
  } else if (acc != null) {
    return acc;
  } else {
    signale.error(`no free accounts found.`);
    throw new Error("no free accounts found.");
  }
}

const returnAccount = async (account, usedAmount) => {
  let [ error, updatedAcc ] = await toPromise(AccountPool.findOneAndUpdate({ id: account.id },
  {
    inUse: false,
    $inc: {
      'ether_amount': -(usedAmount),
      'transactionCount': +(account.transactionCount)
    }
  }));
  if (error) {
    signale.error(`returning account... ${error}`);
    return false;
  } else {
    return true;
  }
}

module.exports = {
  addAccount,
  getNextAccount,
  returnAccount
}

