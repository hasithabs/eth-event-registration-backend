import { Router } from 'express'
const router = new Router()

import user from './user'
import accountPool from './accountPool'
import main from './auth'


router.use('/users', user);
router.use('/ethaccount', accountPool);
router.use('/', main);

export default router
