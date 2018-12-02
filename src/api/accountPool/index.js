import { Router } from 'express'
import { middleware as body } from 'bodymen'

import Account, { schema } from '../../services/accountPool/model'
import {
  getAllAccounts,
  getSingleAccount,
  addAccount,
  updateAccount,
  deleteAccount,
  addToAdminContract
} from './controller'
import { verifyToken } from '../../services/common'

const router = new Router();
const { id, address, network, private_network_id, ether_amount, transactionCount, inUse, lastUsed, privateKey, election_id, inAdminContract } = schema.tree

/* GET ALL USERS */
router.get('/',
  // verifyToken,
  getAllAccounts)

/* GET SINGLE USER BY ID */
router.get('/:id',
  // verifyToken,
  getSingleAccount)

/* SAVE USER */
router.post('/',
  // verifyToken,
  body({ id, address, network, private_network_id, ether_amount, transactionCount, inUse, lastUsed, privateKey, election_id, inAdminContract }),
  addAccount)

/* UPDATE USER */
router.put('/:id',
  // verifyToken,
  updateAccount)

/* DELETE USER */
router.delete('/:id',
  // verifyToken,
  deleteAccount)


module.exports = router;
