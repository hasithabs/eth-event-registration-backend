import User from './model'
import {success, notFound, toPromise} from '../../services/response/'
import {generateHash} from '../../services/common'

var errorMsg = ''

const getAllUsers = (req, res, next) =>
  User.find()
    .then(users => ({
      users: users.map((user) => user.view('PROFILE')),
      count: users.length
    }))
    .then(success(res))
    .catch(next)

const getSingleUser = async (req, res, next) => {
  User.findOne({id: req.params.id})
    .then(notFound(res))
    .then((user) => user ? user.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

const createUser = (req, res, next) => {
  User.create(req.body)
    .then((user) => user ? user.view('FULL') : null)
    .then(success(res, 'Success', 201))
    .catch((err) => {
      for (let prop in err.errors) {
        if (err.errors.hasOwnProperty(prop)) {
          errorMsg += err.errors[prop] + ' '
        }
      }
      if (err.toString().includes('user_name_1 dup key')) {
        errorMsg = 'user name already exists'
      }
      res.status(400).json({status: 400, error: errorMsg})
    })
}

const updateUser = (req, res, next) => {
  if (typeof req.body.password != 'undefined') {
    let password = req.body.password;
    req.body.password = generateHash(password);
  }
  User.findOneAndUpdate({id: req.params.id}, req.body, {new: true})
    .then(notFound(res))
    .then((user) => user ? user.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

const deleteUser = (req, res, next) => {
  User.deleteOne({id: req.params.id})
    .then(notFound(res))
    .then((user) => user ? user.view('FULL') : null)
    .then(success(res))
    .catch(next)
}

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
}
