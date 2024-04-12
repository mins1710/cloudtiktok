const Proxy = require('../models/proxyModel'); // Assuming the model is defined in a file called 'Proxy.js'

// Create a new proxy
async function createProxy(ipAddress, port, username, password) {
    try {
        const proxy = new Proxy({ ipAddress, port, username, password });
        await proxy.save();
        return proxy;
    } catch (err) {
        console.error('Error creating proxy:', err);
        throw new Error('Internal Server Error');
    }
}

 function convertProxies(proxies){
    try {
        const proxiesArray = proxies.split("\n")
        const proxiesObject = proxiesArray.map(proxy => {
            const proxyParts = proxy.split(':').map(line => line);
            return {
                ipAddress: proxyParts[0],
                port: proxyParts[1],
                username: proxyParts[2],
                password: proxyParts[3]
            }
        });
        return proxiesObject;
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}

// Get all proxies
async function getAllProxies() {
    try {
        return await Proxy.find();
    } catch (err) {
        console.error('Error retrieving proxies:', err);
        throw new Error('Internal Server Error');
    }
}

// Get a proxy by ID
async function getProxyById(id) {
    try {
        const proxy = await Proxy.findById(id);
        if (!proxy) {
            throw new Error('Proxy not found');
        }
        return proxy;
    } catch (err) {
        console.error('Error retrieving proxy by ID:', err);
        throw new Error('Internal Server Error');
    }
}

// Update a proxy by ID
async function updateProxyById(id, updateData) {
    try {
        const proxy = await Proxy.findByIdAndUpdate(id, updateData, { new: true });
        if (!proxy) {
            throw new Error('Proxy not found');
        }
        return proxy;
    } catch (err) {
        console.error('Error updating proxy:', err);
        throw new Error('Internal Server Error');
    }
}

// Delete a proxy by ID
async function deleteProxyById(id) {
    try {
        const proxy = await Proxy.findByIdAndDelete(id);
        if (!proxy) {
            throw new Error('Proxy not found');
        }
    } catch (err) {
        console.error('Error deleting proxy:', err);
        throw new Error('Internal Server Error');
    }
}

module.exports = {
    createProxy,
    getAllProxies,
    getProxyById,
    updateProxyById,
    deleteProxyById,
    convertProxies
};
