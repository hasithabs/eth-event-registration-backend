import signale from 'signale'
import _ from 'lodash'

import Account from '../../services/accountPool/model'
import { success, notFound, toPromise } from '../../services/response'
import { generateHash } from '../../services/common'
import { contractMethodCall, contractMethodTransaction } from '../../services/web3'

import CONFIG_SETTINGS from '../../config'

const getAllAccounts = (req, res, next) =>
  Account.find()
    .then(accounts => ({
      ethAccounts: accounts.map((acc) => acc.view('FULL')),
      count: accounts.length
    }))
    .then(success(res))
    .catch(next)

const getSingleAccount = async (req, res, next) => {
  Account.findOne({id: req.params.id})
    .then(notFound(res))
    .then((acc) => acc ? acc.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

const addAccount = ({ bodymen: { body } }, res, next) => {
  Account.create(body)
    .then((acc) => acc ? acc.view('FULL') : null)
    .then(success(res, 'Success', 201))
    .catch((err) => {
      res.status(400).json({status: 400, error: err})
    })
}

const updateAccount = (req, res, next) => {
  Account.findOneAndUpdate({id: req.params.id}, req.body, {new: true})
    .then(notFound(res))
    .then((acc) => acc ? acc.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

const deleteAccount = (req, res, next) => {
  Account.deleteOne({id: req.params.id})
    .then(notFound(res))
    .then((acc) => acc ? acc.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

module.exports = {
  getAllAccounts,
  getSingleAccount,
  addAccount,
  updateAccount,
  deleteAccount
}
