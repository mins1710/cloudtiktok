const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const scriptController = require('../controllers/scriptController');
const {fetchOutlookEmails}  = require("../helper/mail/microsoft");

const fs = require('fs');
const archiver = require('archiver');
const axios = require('axios');
const cheerio = require('cheerio');


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

router.post("/helper/decode/microsoft", async (req,res) => {
  try {
    const {email, password,type,from} = req.body;
   
    const emails = await fetchOutlookEmails(email,password);
    let filteredEmails = emails;
    console.log(filteredEmails)

    if (from){
        console.log(filteredEmails.length);
        filteredEmails = emails.filter(email => email.from.endsWith(from));

    }
    const $ = cheerio.load(filteredEmails[0].html_body);
    if (type == "VERIFY"){
         const href = $('body').find('a').attr('href');
         if (href === "https://support.tiktok.com/" || !href) return res.status(400).send("Invalid URL");
         return res.status(200).send(href);
    }
    if (type == "OTP"){
         const verificationCodeParagraph = $('p').eq(1);
         console.log(verificationCodeParagraph);
         const verificationCode = verificationCodeParagraph.text().trim();
         return res.status(200).send(verificationCode);
    }
    return res.status(400).send("Invalid");
  } catch (error) {
    return res.status(400).send(error.message);
  }
})

router.post("/helper/decode", async(req,res) => {
    try {
        const {email,type} = req.body;
        const response= await axios.post("https://sinhhv.bmctech.one:8080/api/get-mail-by-query",{
            "email": email,
            "filter": "@account.tiktok.com",
            "limit":1
        }, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        
        if (response.data["status"] === "OK"){
                const data = response.data.data;
                const base64String = data[0]["payload"]["body"]["data"]
                const decodedString = Buffer.from(base64String, 'base64').toString();
                const $ = cheerio.load(decodedString);
               if (type == "VERIFY"){
                    const href = $('body').find('a').attr('href');
                    if (href === "https://support.tiktok.com/") return res.status(400).send("Invalid URL");
                    return res.status(200).send(href);
               }
               if (type == "OTP"){
                    const verificationCodeParagraph = $('p').eq(1);
                    console.log(verificationCodeParagraph);
                    const verificationCode = verificationCodeParagraph.text().trim();
                    return res.status(200).send(verificationCode);
               }
        }
        return res.status(400).send("Invalid");
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).send("Invalid message");
    }
})




// Define a route to handle folder download
router.get('/data/sync', (req, res) => {
    const folderPath = './uploads/scripts/scripts'; 
    const archive = archiver('zip', {
        zlib: { level: 9 } // Compression level
    });

    const archiveName = 'data.zip';
    res.attachment(archiveName);
    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();
});

module.exports = router;
