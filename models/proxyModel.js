const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the proxy
const proxySchema = new Schema({
  ipAddress: {
    type: String,
  },
  port: {
    type: String,
  },
  username: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  counter: {
    type: Number,
    default: 0
  }
});

// Create the model based on the schema
const Proxy = mongoose.model('Proxy', proxySchema);

module.exports = Proxy;
