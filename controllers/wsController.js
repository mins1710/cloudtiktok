// wsController.js
const {Device} = require("../models/deviceModel");
const {authenticateDevice,disconnectDevice} = require("./deviceController")
// Store connected devices
const connectedDevices = new Map();

// Function to handle WebSocket connections
function handleConnection(ws,req) {

  
  let match = req.url.match(/\/([^/]+)/g);
  const serialNumber = match[0].slice(1);
  const wifi_address = match[1].slice(1);
  authenticateDevice(serialNumber,wifi_address);
  console.log('New device connected');

  // Authenticate device
  // 
  connectedDevices.set(serialNumber,ws);
  
  // Listen for messages from device
  ws.on('message', function incoming(message) {
    console.log(`Message from device ${serialNumber}:`, Buffer.from(message).toString('utf8'));
    // Handle incoming message, e.g., execute commands
  });
  
  // Handle device disconnection
  ws.on('close', function () {
    console.log('Device disconnected');

    // Remove device from connectedDevices set
    connectedDevices.delete(serialNumber);
    disconnectDevice(serialNumber);
  });
}
function sendMessageToSerialNumber(serialNumber, message) {
  const device = connectedDevices.get(serialNumber);
  if (device) {
    device.send(JSON.stringify(message));
  } else {
    console.log(`Device with serial number ${serialNumber} not found.`);
  }
}
// Function to send message to all connected devices
function sendMessageToAll(message) {
  connectedDevices.forEach(function each(device) {
    device.send(JSON.stringify(message));
  });
}// Function to get all connected devices
function getAllConnectedDevices() {
  return Array.from(connectedDevices.keys());
}
// Export WebSocket controller functions
module.exports = { handleConnection, sendMessageToAll, getAllConnectedDevices ,sendMessageToSerialNumber};
