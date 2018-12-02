import signale from 'signale';
import _ from 'lodash';
import Web3 from 'web3';

import { getNextAccount, returnAccount, getEthMainAccountPvtKey } from '../accountPool';
import CONFIG_SETTINGS from '../../config';

var web3 = new Web3();
const providerAccessToken = CONFIG_SETTINGS.NETWORK.ACCESS_TOKEN;

var mainEthAccount;


const sendEtherToAccount = async (_network, _formAddressPvtKey, _toAddress, _value) => {
  let providerURL = _.get(CONFIG_SETTINGS, `NETWORK.${_network.toUpperCase()}.URL`) + providerAccessToken;
  await setupEthConnection(providerURL, _formAddressPvtKey);

  let amount = await web3.utils.toWei(_value.toString(), 'finney');
  signale.info(`amount: ${amount}`);

  signale.info('sending ether...');
  await web3.eth.sendTransaction({
      from: mainEthAccount.address,
      to: _toAddress,
      value: amount,
      gas: 50000
    })
    .then(function(receipt) {
      console.log(receipt);
    });
}

const getAccountBalance = async (_network, _accountAddress) => {
  let providerURL = _.get(CONFIG_SETTINGS, `NETWORK.${_network.toUpperCase()}.URL`) + providerAccessToken;
  await setProvider(providerURL);

  signale.info('getting wei balance...');
  let balanceWei = await web3.eth.getBalance(_accountAddress);
  let balanceEther = await web3.utils.fromWei(balanceWei.toString(), 'ether');
  signale.info(`balanceEther: ${balanceEther}`);

  return balanceEther;
}

/**
 * Sets the provider.
 *
 * @param      {string}  provider  The provider
 */
const setProvider = function (provider) {
  web3.setProvider(new web3.providers.HttpProvider(provider));
}

/**
 * Creates a contract instance.
 *
 * @param      {object}  contractABI      The contract abi
 * @param      {string}  contractAddress  The contract address
 */
const createContractInstance = function (contractABI, contractAddress) {
  this.ContractInstance = new web3.eth.Contract(contractABI, contractAddress)
}

/**
 * Wait for the transaction to be mined
 *
 * @param      {string}  _transactionHash  The transaction hash
 * @return     {object}  Transaction receipt
 */
const waitForTransactionReceipt = (_transactionHash) => {
  setTimeout(async function () {
    let receipt = await web3.eth.getTransactionReceipt(_transactionHash)
    if (receipt) {
      console.log('Your contract has been deployed at http://testnet.etherscan.io/address/' + receipt.contractAddress)
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io")
    } else {
      waitForTransactionReceipt(_transactionHash)
    }
    console.log('Waiting a mined block to include your transaction... currently in block ' + await web3.eth.getBlockNumber())
  }, 5000)
}

const setupEthConnection = async (provider, pvtKey) => {
  signale.info('setting web3 provider...');
  await setProvider(provider);

  signale.info('setting web3 eth account...');
  mainEthAccount = await web3.eth.accounts.privateKeyToAccount('0x' + pvtKey);
  await web3.eth.accounts.wallet.add(mainEthAccount);
  web3.eth.defaultAccount = mainEthAccount.address;
}

/**
 * Encrypt Eth Account
 *
 * @param      {Object}  account  The Eth account
 * @return     {Object}  Encrypted Account
 */
const encryptAccount = async (account) => {
  signale.info('encrypting...');
  let encryptedAccount = await web3.eth.accounts.encrypt(account.pvtKey, CONFIG_SETTINGS.ACCOUNT_POOL.ENCRYPT_PASSOWRD);

  return encryptedAccount;
}

/**
 * Decrypt Eth Account
 *
 * @param      {Object}  encryptedPrivateKey  The encrypted object
 * @return     {Object}  Decrypted Account
 */
const decryptAccount = async (encryptedPrivateKey) => {
  signale.info('decrypting...');
  let decryptedAccount = await web3.eth.accounts.encrypt(encryptedPrivateKey, CONFIG_SETTINGS.ACCOUNT_POOL.ENCRYPT_PASSOWRD);

  return decryptedAccount;
}

/**
 * Deploy smart contract to Network
 *
 * @param      {string}  provider      The Eth node provider
 * @param      {string}  pvtKey        The Eth private key
 * @param      {array}   abi           The contract abi
 * @param      {string}  bytecode      The contract bytecode
 * @param      {array}   contractArgs  The contract arguments
 * @return     {object}  Deployed contract's transaction receipt
 */
const sendEthSmartContractTransaction = async (provider, pvtKey, abi, bytecode, contractArgs) => {
  let deployContractObj, gasLimit, transactionHash, receipt

  signale.info('setting web3 provider...')
  await setProvider(provider)

  signale.info('setting web3 eth account...')
  await setupEthConnection(provider, pvtKey);

  signale.info('Creating new contract instance.....')
  deployContractObj = await new web3.eth.Contract(abi)
  deployContractObj.options.data = bytecode;

  signale.info('estimateGas.....')
  gasLimit = await deployContractObj.deploy({
      arguments: contractArgs
    })
    .estimateGas()
  signale.info(`gasLimit - ${gasLimit}`);

  signale.info('deploying contract...')
  await deployContractObj.deploy({
      arguments: contractArgs
    })
    .send({
      from: mainEthAccount.address,
      gas: gasLimit
    }, async function(error, _transactionHash) {
        if (error) {
            signale.error(error);
        }
        signale.info('_transactionHash - ' + _transactionHash)
        transactionHash = _transactionHash
        await waitForTransactionReceipt(transactionHash)
    })
    .on('receipt', function(_receipt) {
        receipt = _receipt
    })

  signale.info('Contract deployment end.')
  return receipt
}

/**
 * Invoke contract method calling
 *
 * @param      {string}  provider         The Eth node provider
 * @param      {string}  pvtKey           The Eth private key
 * @param      {array}   abi              The contract abi
 * @param      {string}  contractAddress  The contract address
 * @param      {string}  methodName       The method name
 * @param      {array}   methodArgs       The method arguments
 * @return     {object}  method call response
 */
const invokeContractMethodCall = async (provider, pvtKey, abi, contractAddress, methodName, methodArgs) => {
  var deployContractObj, callData;

  await setupEthConnection(provider, pvtKey);

  signale.info('Getting contract instance...')
  deployContractObj = await new web3.eth.Contract(abi, contractAddress);

  methodArgs = methodArgs == null ? [] : methodArgs;
  signale.info('calling method...');
  callData = await deployContractObj.methods[methodName](...methodArgs).call({ 'from': mainEthAccount.address });
  signale.info('callData');
  signale.info(callData);

  return callData
}

/**
 * Invoke contract method transaction
 *
 * @param      {string}  provider         The Eth node provider
 * @param      {string}  accAddress       The Eth account address
 * @param      {string}  pvtKey           The Eth private key
 * @param      {array}   abi              The contract abi
 * @param      {string}  contractAddress  The contract address
 * @param      {string}  methodName       The method name
 * @param      {array}   methodArgs       The method arguments
 * @return     {object}  method receipt
 */
const invokeContractMethodTransaction = async (provider, accAddress, pvtKey, abi, contractAddress, methodName, methodArgs) => {
  var deployContractObj, gasLimit, receipt, transactionHash;

  await setupEthConnection(provider, pvtKey);

  signale.info('Getting contract instance...')
  deployContractObj = await new web3.eth.Contract(abi, contractAddress)

  methodArgs = methodArgs == null ? [] : methodArgs;

  signale.info('estimateGas...');
  gasLimit = await deployContractObj.methods[methodName](...methodArgs).estimateGas({from: accAddress, 'gas': 850000});
  signale.info(`gasLimit - ${gasLimit}`);

  signale.info('sending transaction...')
  receipt = await deployContractObj.methods[methodName](...methodArgs).send({ from: accAddress, 'gas': gasLimit }, async function (error, _transactionHash) {
    signale.info('_transactionHash - ' + _transactionHash);
    transactionHash = _transactionHash;
    await waitForTransactionReceipt(transactionHash);
  });
  signale.info('receipt');
  signale.info(receipt);

  return receipt;
};

/**
 * Deploy Smart Contract
 *
 * @param      {string}  network       The network provider
 * @param      {string}  contractName  The contract name
 * @param      {array}   contractArgs  The contract arguments
 * @return     {object}  deployed contract receipt
 */
const deploySmartContract = async (_electionObj, _contractName, _contractArgs) => {
  let providerURL = _.get(CONFIG_SETTINGS, `NETWORK.${_electionObj.network.toUpperCase()}.URL`) + providerAccessToken;

  // let specificAccountPvtKey = _.get(CONFIG_SETTINGS, `NETWORK.${_network.toUpperCase()}.ACCOUNT_PVT_KEY`);
  let specificAccount = await getNextAccount(_network);
  specificAccount.pvtKey = specificAccount.privateKey;
  // let specificAccountPvtKey = await getEthMainAccountPvtKey(_electionObj.network, _electionObj.account_selection, _electionObj.id);
  let contractBytecode = _.get(CONFIG_SETTINGS, `CONTRACTS.${_contractName.toUpperCase()}.BYTECODE`);
  let contractABI = _.get(CONFIG_SETTINGS, `CONTRACTS.${_contractName.toUpperCase()}.ABI`);

  signale.info(`providerURL - ${providerURL}
                specificAccountPvtKey - ${_.truncate(specificAccount.pvtKey, {'length': 6})}
                contractBytecode - ${contractBytecode}
                contractABI - ${contractABI}
                network - ${_electionObj.network}
                contractName - ${_contractName}
                contractArgs - ${_contractArgs}`)

  let contractReceipt = await sendEthSmartContractTransaction(providerURL, specificAccount.pvtKey, contractABI, contractBytecode, _contractArgs);

  return contractReceipt;
}

/**
 * Contract method call
 *
 * @param      {string}  network           The network provider
 * @param      {string}  _contractName     The contract name
 * @param      {string}  _contractAddress  The contract address
 * @param      {number}  _methodName       The method name
 * @param      {array}   _methodArgs       The method arguments
 * @return     {object}  method response
 */
const contractMethodCall = async (_electionObj, _contractName, _contractAddress, _methodName, _methodArgs) => {
  let providerURL = _.get(CONFIG_SETTINGS, `NETWORK.${_electionObj.network.toUpperCase()}.URL`) + providerAccessToken;

  let specificAccountPvtKey = await getEthMainAccountPvtKey(_electionObj.network, _electionObj.account_selection, _electionObj.id);
  let contractABI = _.get(CONFIG_SETTINGS, `CONTRACTS.${_contractName.toUpperCase()}.ABI`);

  signale.info(`providerURL - ${providerURL}
                specificAccountPvtKey - ${_.truncate(specificAccountPvtKey, {'length': 6})}
                contractABI - ${contractABI}
                _contractName - ${_contractName}
                _contractAddress - ${_contractAddress}
                _methodName - ${_methodName}
                _methodArgs - ${_methodArgs}`);

  let methodResponse = await invokeContractMethodCall(providerURL, specificAccountPvtKey, contractABI, _contractAddress, _methodName, _methodArgs);

  return methodResponse;
}

/**
 * Contract method transaction
 *
 * @param      {string}  network           The network provider
 * @param      {string}  _contractName     The contract name
 * @param      {string}  _contractAddress  The contract address
 * @param      {number}  _methodName       The method name
 * @param      {array}   _methodArgs       The method arguments
 * @return     {object}  method response
 */
const contractMethodTransaction = async (_network, _contractName, _contractAddress, _methodName, _methodArgs) => {
  let providerURL = _.get(CONFIG_SETTINGS, `NETWORK.${_network.toUpperCase()}.URL`) + providerAccessToken;

  let specificAccount = await getNextAccount(_network);
  specificAccount.pvtKey = specificAccount.privateKey;

  let contractABI = _.get(CONFIG_SETTINGS, `CONTRACTS.${_contractName.toUpperCase()}.ABI`);

  signale.info(`providerURL - ${providerURL}
                specificAccount.address - ${specificAccount.address}
                specificAccount.pvtKey - ${_.truncate(specificAccount.pvtKey, {'length': 6})}
                contractABI - ${contractABI}
                _contractName - ${_contractName}
                _contractAddress - ${_contractAddress}
                _methodName - ${_methodName}
                _methodArgs - ${_methodArgs}`);

  let methodResponse = await invokeContractMethodTransaction(providerURL, specificAccount.address, specificAccount.pvtKey, contractABI, _contractAddress, _methodName, _methodArgs);

  let usedEther = await web3.utils.fromWei(methodResponse.gasUsed.toString(), 'ether');
  returnAccount(specificAccount, usedEther);

  return methodResponse
}

module.exports = {
  deploySmartContract: deploySmartContract,
  contractMethodCall: contractMethodCall,
  contractMethodTransaction: contractMethodTransaction,
  sendEtherToAccount: sendEtherToAccount,
  getAccountBalance: getAccountBalance
}
