import { middleware as body } from 'bodymen'
import { Router } from 'express'

import {
  getAllTickets,
  getSingleTicket,
  createTicket,
  updateTicket,
  deleteTicket
} from './controller'
import Ticket, { schema } from './model'

export {  } from './controller';
export Ticket, { schema } from './model'

const router = new Router()
const { id, uport_id, first_name, last_name, gender, birthday, mobile, email, img_path } = schema.tree

/* GET ALL TICKETS */
router.get('/',
  // verifyToken,
  getAllTickets)

/* GET SINGLE TICKET BY ID */
router.get('/:id',
  // verifyToken,
  getSingleTicket)

/* SAVE TICKET */
router.post('/',
  body({
    id,
    uport_id,
    first_name,
    last_name,
    gender,
    birthday,
    mobile,
    email,
    img_path
  }),
  createTicket)

// /* UPDATE TICKET */
// router.put('/:id',
//   // verifyToken,
//   body({ name, description, transparency, start_date, end_date }),
//   updateTicket)

/* DELETE TICKET */
router.delete('/:id',
  // verifyToken,
  deleteTicket)


export default router
