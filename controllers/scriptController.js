const Script = require('../models/scriptModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    sendMessageToSerialNumber,
    sendMessageToAll,
  } = require("../controllers/wsController");
// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/scripts');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


// ScriptController object
const scriptController = {};
scriptController.upload = multer({ storage: storage });

// Controller for uploading a script
scriptController.uploadScript = async (name, content, filePath) => {
    try {
        const script = new Script({ name, content, filePath });
        await script.save();
        return script;
    } catch (error) {
        console.error('Error uploading script:', error);
        throw new Error('Internal Server Error');
    }
};

// Controller for creating a script document in the database
scriptController.createScript = async (name, content, filePath) => {
    try {
        const script = new Script({ name, content, filePath });
        await script.save();
        return script;
    } catch (error) {
        console.error('Error creating script:', error);
        throw new Error('Internal Server Error');
    }
};

// Controller for retrieving all scripts
scriptController.getAllScripts = async () => {
    try {
        const scripts = await Script.find();
        return scripts;
    } catch (error) {
        console.error('Error retrieving scripts:', error);
        throw new Error('Internal Server Error');
    }
};

// Controller for retrieving a script by ID
scriptController.getScriptById = async (id) => {
    try {
        const script = await Script.findById(id);
        if (!script) {
            throw new Error('Script not found');
        }
        return script;
    } catch (error) {
        console.error('Error retrieving script:', error);
        throw new Error('Internal Server Error');
    }
};

// Controller for updating a script by ID
scriptController.updateScriptById = async (id, name, content, filePath) => {
    try {
        const updatedScript = await Script.findByIdAndUpdate(id, { name, content, filePath }, { new: true });
        if (!updatedScript) {
            throw new Error('Script not found');
        }
        return updatedScript;
    } catch (error) {
        console.error('Error updating script:', error);
        throw new Error('Internal Server Error');
    }
};

// Controller for deleting a script by ID
scriptController.deleteScriptById = async (id) => {
    try {
        const script = await Script.findByIdAndDelete(id);
        if (!script) {
            throw new Error('Script not found');
        }
        // Assuming 'file' is the property of 'script' containing the file path
        const filePath = script.filePath;
        if (filePath) {
            // Deleting the associated file
            fs.unlinkSync(filePath); // Synchronously unlink (delete) the file
        }
        return { message: 'Script deleted successfully' };
    } catch (error) {
        console.error('Error deleting script:', error);
        throw new Error('Internal Server Error');
    }

};

scriptController.runScript = async (name,serialNumber) => {
    console.log(name);

    const script = await Script.findOne({name: name})
    if (!script) throw new Error('Script not found');
    if (!serialNumber) throw new Error('Serial number not found');
    let message = {"type": "script/put","body": {"name": script.name,"data":  fs.readFileSync(script.filePath, { encoding: 'base64' })}};
    sendMessageToSerialNumber(serialNumber, message);
    message.type = 'script/run';
    sendMessageToSerialNumber(serialNumber, message);
}
scriptController.runScriptAll = async (name) => {
    const script = await Script.findOne({name: name})
    if (!script) throw new Error('Script not found');
    let message = {"type": "script/put","body": {"name": script.name,"data":  fs.readFileSync(script.filePath, { encoding: 'base64' })}};
    sendMessageToAll(message);
    message.type = 'script/run';
    sendMessageToAll(message);
}

module.exports = scriptController;
