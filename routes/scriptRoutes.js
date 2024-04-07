const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const scriptController = require('../controllers/scriptController');

// Set up multer for handling file uploads

// Route for uploading a script
router.post('/scripts/upload', scriptController.upload.single('script'), async (req, res) => {
    try {
        const { name, content } = req.body;
        const filePath = req.file.path;

        const script = await scriptController.uploadScript(name, content, filePath);
        res.status(201).json("Success");
    } catch (error) {
        console.error('Error uploading script:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for retrieving all scripts
router.get('/scripts', async (req, res) => {
    try {
        const scripts = await scriptController.getAllScripts();
        res.json(scripts);
    } catch (error) {
        console.error('Error retrieving scripts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for retrieving a script by ID
router.get('/scripts/:id', async (req, res) => {
    try {
        const script = await scriptController.getScriptById(req.params.id);
        res.json(script);
    } catch (error) {
        console.error('Error retrieving script:', error);
        if (error.message === 'Script not found') {
            return res.status(404).json({ error: 'Script not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for updating a script by ID
router.put('/scripts/:id', scriptController.upload.single('script'), async (req, res) => {
    try {
        const { name, content } = req.body;
        const filePath = req.file.path;

        const updatedScript = await scriptController.updateScriptById(req.params.id, name, content, filePath);
        res.json(updatedScript);
    } catch (error) {
        console.error('Error updating script:', error);
        if (error.message === 'Script not found') {
            return res.status(404).json({ error: 'Script not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for deleting a script by ID
router.delete('/scripts/:id', async (req, res) => {
    try {
        await scriptController.deleteScriptById(req.params.id);
        res.json({ message: 'Script deleted successfully' });
    } catch (error) {
        console.error('Error deleting script:', error);
        if (error.message === 'Script not found') {
            return res.status(404).json({ error: 'Script not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/scripts/run" , async (req, res) => {
    try {
        const {serialNumber,name} = req.body;
        scriptController.runScript(name, serialNumber);
        return res.status(200).json({status: "Success"});
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.post("/scripts/runAll" , async (req, res) => {
    try {
        const {name} = req.body;
        scriptController.runScriptAll(name);
        return res.status(200).json({status: "Success"});
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
