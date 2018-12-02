import mongoose, {Schema} from 'mongoose'
import _ from 'lodash'

import {generateHash, switchcaseF} from '../../services/common'

var UserSchema = new Schema({
  id: {type: Number, required: true, unique: true},
  user_name: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  type: {type: String, enum: ['admin', 'generalUser', 'testUser'], default: 'testUser'}
}, {
  versionKey: false,
  timestamps: true,
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

UserSchema.pre('save', async function (next) {
  let self = this;
  if (this.isModified('password')) {
    self.password = generateHash(self.password);
  }
  await model.findOne({}, ['id']).sort({id: -1}).exec((err, resultMaxId) => {
    if (resultMaxId == null || resultMaxId.length == 0) {
      self.id = 1
    } else {
      self.id = resultMaxId.id + 1
    }
  });
  next();
});

UserSchema.methods = {
  view (type) {
    let view = {}
    let fields = ['id', 'name']

    const fieldCreation = (defaultFields, modelType) =>
      switchcaseF({
        'FULL': () => [..._.keys(UserSchema.tree)],
        'PROFILE': () => [...defaultFields, 'user_name', 'type']
      })(defaultFields)(modelType)

    fields = fieldCreation(fields, type);
    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
};

const model = mongoose.model('User', UserSchema);

export const schema = model.schema;
export default model;
