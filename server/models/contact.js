var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String},
  imageURL: {type: String},
  group: [{type: Schema.Types.ObjectId, ref: 'Contact'}]
});

module.exports = mongoose.model('Contact', schema);
