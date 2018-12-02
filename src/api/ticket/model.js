import _ from 'lodash'
import mongoose, { Schema } from 'mongoose'

import { switchcase, switchcaseF } from '../../services/common'

var TicketSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  uport_id: { type: String, required: true, unique: false },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, required: true, enum: ['MALE', 'FEMALE'] },
  birthday: { type: Date, required: false },
  mobile: { type: String, required: false },
  email: { type: String, required: true, lowercase: true },
  img_path: { type: String, required: true },
  status: { type: Number, min: 0, max: 2, default: 0 },
  contract_address: { type: String },
  tx_hash: { type: String }
}, {
  versionKey: false,
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

TicketSchema.virtual('status_text').get(function () {
  const privacySelect = (defaultFields, modelType) =>
      switchcase({
        0: 'Pending',
        1: 'Valid',
        2: 'Expired'
      })(defaultFields)(modelType)

    return privacySelect(null, this.status);
})

TicketSchema.pre('save', async function (next) {
  var self = this
  await model.findOne({}, ['id']).sort({id: -1}).exec((err, resultMaxId) => {
    if (resultMaxId == null || resultMaxId.length == 0) {
      self.id = 1
    } else {
      self.id = resultMaxId.id + 1
    }
  })
  next()
})

TicketSchema.methods = {
  view (type) {
    let view = {}
    let fields = ['id', 'name']

    const fieldCreation = (defaultFields, modelType) =>
      switchcaseF({
        'FULL': () => [..._.keys(TicketSchema.tree)]
      })(defaultFields)(modelType)

    fields = fieldCreation(fields, type);
    fields.forEach((field) => { view[field] = this[field] })

    return view
  }
}

const model = mongoose.model('Ticket', TicketSchema)

export const schema = model.schema
export default model
