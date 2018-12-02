import signale from 'signale'
import _ from 'lodash'

import { Ticket } from '.';

import { success, notFound, toPromise } from '../../services/response'
import commonHelper from '../../services/common'
import { deploySmartContract, contractMethodCall, contractMethodTransaction } from '../../services/web3'
import CONFIG_SETTINGS from '../../config'


const getAllTickets = (req, res, next) => {
  Ticket.find(req.query)
    .then(tickets => ({
      tickets: tickets.map((ticket) => ticket.view('FULL')),
      count: tickets.length
    }))
    .then(success(res))
    .catch(next)
}

const getSingleTicket = async ({ params }, res, next) => {
  Ticket.findOne({id: params.id})
    .then(notFound(res))
    .then((ticket) => ticket ? ticket.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

const createTicket = ({ bodymen: { body } }, res, next) => {
  Ticket.create(body)
    .then((ticket) => ticket ? ticket.view('FULL') : null)
    .then(async (ticket) => {
      let contractParams = [
        ticket.uport_id,
        ticket.id,
        ticket.first_name + ticket.last_name,
        ticket.email,
        ((ticket.birthday).getTime() / 1000),
        _.get(CONFIG_SETTINGS, `NETWORK.RINKEBY.ADMIN_BASE_ADDRESS`)
      ];

      signale.info('Starting contract creation...');
      let [ errDeploy, ticketContractReceipt ] = await toPromise(deploySmartContract("EVENT_TICKET", contractParams))
      if (errDeploy) {
        await toPromise(Ticket.deleteOne({id: ticket.id}))
        return success(res, "No free Ethereum account for contract deployment!", 500)(ticket)
      };

      signale.info('Contract deployment complete.')
      signale.log(ticketContractReceipt)

      signale.info('updating ticket hashes...');
      let [error, ticketwithHash] = await toPromise(Ticket.findOneAndUpdate({ id: ticket.id }, {
        'contract_address': ticketContractReceipt.contractAddress,
        'tx_hash': ticketContractReceipt.transactionHash
      }, { new: true }));
      if (error) {
        signale.error(`ticket object deleting... ${error}`)
        await toPromise(Ticket.deleteOne({id: ticket.id}))
        return success(res, "Update tikcet failed!", 500)(error)
      }
      signale.info('updated ticket hashes...');

      let results = { ticket: ticketwithHash };
      success(res, 'Ticket created.', 201)(results)
    })
    .catch(next)
}

const updateTicket = ({ bodymen: { body }, params }, res, next) => {
  Ticket.findOneAndUpdate({id: params.id}, body, { new: true })
    .then(notFound(res))
    .then((ticket) => ticket ? ticket.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

const deleteTicket = (req, res, next) => {
  Ticket.deleteOne({id: req.params.id})
    .then(notFound(res))
    .then((ticket) => ticket ? ticket.view('FULL') : null)
    .then(success(res))
    .catch(next)
}


module.exports = {
  getAllTickets,
  getSingleTicket,
  createTicket,
  updateTicket,
  deleteTicket
}
