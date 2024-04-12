const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ipAddress: { type: String, required: true },
  wifi_address: {type:String , required: true},
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  scripts: [{ type: String }], // Array of script names associated with the device
  createdDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  totalActiveTime: { type: Number, default: 0 }, // Assuming this is meant to be total active time
  totalInactiveTime: { type: Number, default: 0 }, // Assuming this is meant to be total inactive time
  totalActiveDay: { type: Number, default: 0 },
  serialNumber: {type: String, required:true, unique: true},
  recentMessages: [{ type: String }]
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
