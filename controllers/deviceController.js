const Device = require('../models/deviceModel');

exports.authenticateDevice = async (serialNumber) => {
 try {
  let device = await Device.findOne({serialNumber: serialNumber});
  if (!device) device = await  this.createDevice({name : serialNumber, ipAddress: "127.0.0.1", status : 'online', scripts : [],serialNumber: serialNumber});
  this.updateDeviceStatus({"id": device._id, "status": "online"});
 } catch (error) {
  console.log(error.message);
 }
}

exports.disconnectDevice = async (serialNumber) => {
  try {
    const device = await Device.findOne({serialNumber: serialNumber})
    this.updateDeviceStatus({"id": device._id, "status": "offline"});
  } catch (error) {
    console.log(error.message);
  }

}

// Get all devices
exports.getAllDevices = async () => {
  try {
    const devices = await Device.find();
    return { status: 200, data: devices };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

// Create a new device
exports.createDevice = async ({ name, ipAddress, status = 'offline', scripts = [] ,serialNumber}) => {
  const device = new Device({
    name,
    ipAddress,
    status,
    scripts,
    serialNumber
  });

  try {
    const newDevice = await device.save();
    return { status: 201, data: newDevice };
  } catch (error) {
    return { status: 400, error: error.message };
  }
};

// Update device status
exports.updateDeviceStatus = async ({ id, status }) => {
  try {
    const device = await Device.findById(id);
    if (device == null) {
      return { status: 404, error: 'Device not found' };
    }
    device.status = status;
    const updatedDevice = await device.save();
    return { status: 200, data: updatedDevice };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

// Delete a device
exports.deleteDevice = async ({ id }) => {
  try {
    await Device.findByIdAndRemove(id);
    return { status: 200, message: 'Device deleted' };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};
