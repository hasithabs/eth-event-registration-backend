import { Router } from 'express'
const router = new Router()

import user from './user'
import accountPool from './accountPool'
import main from './auth'
import ticket from './ticket'


router.use('/users', user);
router.use('/ethaccount', accountPool);
router.use('/', main);
router.use('/ticket', ticket);

export default router
