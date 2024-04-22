const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  deviceModels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceModel'
  }],
  proxies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProxyModel'
  }],
  script: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScriptModel'
  }
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
