const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');
const Proxy = require("../models/proxyModel")

// Route to create a new proxy
router.post('/proxies', async (req, res) => {
    const { ipAddress, port, username, password } = req.body;
    try {
        const proxy = await proxyController.createProxy(ipAddress, port, username, password);
        res.status(201).json(proxy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/proxies/import", async(req,res) => {
    try {
        const proxies =  proxyController.convertProxies(req.body.proxies);
        console.log(proxies.length)
        await Proxy.insertMany(proxies);
        return res.status(200).json({proxies: "proxies"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error")
    }
})

// Route to get all proxies
router.get('/proxies', async (req, res) => {
    try {
        const proxies = await proxyController.getAllProxies();
        res.json(proxies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/proxies/random', async (req,res) => {
    try {
        const proxies  = await Proxy.find({}).sort({"counter": 1});
        const selectedProxy = proxies[0];
        selectedProxy.counter += 1;
        await selectedProxy.save();
        return res.status(200).json({proxy: selectedProxy})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

// Route to get a proxy by ID
router.get('/proxies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const proxy = await proxyController.getProxyById(id);
        res.json(proxy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update a proxy by ID
router.put('/proxies/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedProxy = await proxyController.updateProxyById(id, updateData);
        res.json(updatedProxy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a proxy by ID
router.delete('/proxies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await proxyController.deleteProxyById(id);
        res.json({ message: 'Proxy deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
