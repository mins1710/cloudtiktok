// routes/deviceRoutes.js

const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const {sendMessageToSerialNumber,sendMessageToAll} = require("../controllers/wsController");
// Routes for managing devices

// Get all devices
router.get('/', deviceController.getAllDevices);
router.post("/spawn_command", (req,res) => {

    try {
        const {serialNumber,command} = req.body;
        if (!req.body.serialNumber) throw new Error("Not found device");
        sendMessageToSerialNumber(serialNumber, {"command": command});
        return res.status(200).send("Messages sent");

    } catch (error) {
        return res.status(500).send(error);
    }
})

router.post("/send", (req,res) => {
   try {
        const {serialNumber,message} = req.body;
        sendMessageToSerialNumber(serialNumber, message);
        return res.status(200).send(serialNumber);
   } catch (error) {
        return res.status(500).send(error);
   }
});
router.post("/sendAll", (req,res) => {
   try {
        const {message} = req.body;
        sendMessageToAll(message);
        return res.status(200).send("All");
   } catch (error) {
        console.log(error)
        return res.status(500).send(error);
   }
});
// Create a new device
router.post('/', deviceController.createDevice);

// Update device status
router.patch('/:id', deviceController.updateDeviceStatus);

// Delete a device
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;
