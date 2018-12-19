var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  maxDocumentId: {type: String, required: true},
  maxMessageId: {type: String, required: true},
  maxContactId: {type: String, required: true},
  phone: {type: String},
  imageURL: {type: String},
  group: [{type: Schema.Types.ObjectId, ref: 'Sequence'}]
});

module.exports = mongoose.model('Sequence', schema);
