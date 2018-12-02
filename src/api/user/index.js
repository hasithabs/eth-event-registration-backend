import {Router} from 'express'

import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
} from './controller'
import {verifyToken} from '../../services/common'

const router = new Router();

/* GET ALL USERS */
router.get('/',
  verifyToken,
  getAllUsers)

/* GET SINGLE USER BY ID */
router.get('/:id',
  // verifyToken,
  getSingleUser)

/* SAVE USER */
router.post('/',
  // verifyToken,
  createUser)

/* UPDATE USER */
router.put('/:id',
  // verifyToken,
  updateUser)

/* DELETE USER */
router.delete('/:id',
  // verifyToken,
  deleteUser)

module.exports = router;
