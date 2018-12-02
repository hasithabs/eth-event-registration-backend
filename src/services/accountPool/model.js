import mongoose, { Schema } from 'mongoose'
import _ from 'lodash'

import { ElectionConfig } from '../../api/electionConfig';
import { switchcaseF } from '../common'

var AccountPoolSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  address: { type: String },
  network: { type: String, required: true, uppercase: true, enum: ['RINKEBY', 'ROPSTEN', 'KOVAN', 'PRIVATE'] },
  private_network_id: { type: String },
  ether_amount: { type: Number, default: 0.0 },
  transactionCount: { type: Number, default: 0 },
  inUse: { type: Boolean, default: false },
  lastUsed: { type: Date },
  privateKey: { type: String },
  inAdminContract: { type: Boolean, default: false }
}, {
  versionKey: false,
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

AccountPoolSchema.pre('save', async function(next) {
  var self = this;
  self.lastUsed = new Date().toISOString();
  await model.findOne({}, ['id']).sort({ id: -1 }).exec((err, resultMaxId) => {
    if (resultMaxId == null || resultMaxId.length == 0) {
      self.id = 1
    } else {
      self.id = resultMaxId.id + 1
    }
  })
  next()
});

AccountPoolSchema.methods = {
  view(type) {
    let view = {}
    let fields = ['id', 'address', 'network']

    const fieldCreation = (defaultFields, modelType) =>
      switchcaseF({
        'FULL': () => [..._.keys(AccountPoolSchema.tree)],
        'ETHER': () => [...defaultFields, 'ether_amount'],
        'ACCOUNT': () => [...defaultFields, 'privateKey']
      })(defaultFields)(modelType)

    fields = fieldCreation(fields, type);
    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

const model = mongoose.model('AccountPool', AccountPoolSchema);

export const schema = model.schema;
export default model;
