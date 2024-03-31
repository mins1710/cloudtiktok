// routes/deviceRoutes.js

const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const {
  sendMessageToSerialNumber,
  sendMessageToAll,
} = require("../controllers/wsController");
const Device = require("../models/deviceModel");
// Routes for managing devices

// Get all devices
router.get("/", deviceController.getAllDevices);
router.post("/spawn_command", (req, res) => {
  try {
    const { serialNumber, command } = req.body;
    if (!req.body.serialNumber) throw new Error("Not found device");
    sendMessageToSerialNumber(serialNumber, { command: command });
    return res.status(200).send("Messages sent");
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/run_script", (req, res) => {
  //TODO: Implement run script
  try {
    const { serialNumbers, script } = req.body;
    console.log("🚀 ~ router.post ~ req:", req)
    console.log("🚀 ~ router.post ~ req.body:", req.body)
    console.log("🚀 ~ router.post ~ serialNumbers:", serialNumbers)
    return res.status(200).send("Messages sent");
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/send", (req, res) => {
  try {
    const { serialNumber, message } = req.body;
    console.log("🚀 ~ router.post ~ req.body:", req.body);
    sendMessageToSerialNumber(serialNumber, message);
    return res.status(200).send(serialNumber);
  } catch (error) {
    return res.status(500).send(error);
  }
});
router.post("/sendAll", (req, res) => {
  try {
    const { message } = req.body;
    sendMessageToAll(message);
    return res.status(200).send("All");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/recent_messages", async (req,res) => {
  try {
    const {message,serialNumber} = req.body;
    const device = await Device.findOne({serialNumber: serialNumber});
    if (!device) throw new Error("Device not found");
    device.recentMessages.push(message);
    await device.save();
    return res.status(200).send("Updated recent messages");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
})
// Create a new device
router.post("/", deviceController.createDevice);

// Update device status
router.patch("/:id", deviceController.updateDeviceStatus);

// Delete a device
router.delete("/:id", deviceController.deleteDevice);

module.exports = router;
