const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Route to create a new account
router.post('/accounts', async (req, res) => {
    try {
        const newAccount = await accountController.createAccount(req.body);
        res.json(newAccount);
    } catch (error) {
        res.status(500).json({ error: 'Could not create account' });
    }
});

// Route to get all accounts
router.get('/accounts', async (req, res) => {
    try {
        const accounts = await accountController.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch accounts' });
    }
});

// Route to update an account
router.put('/accounts/:id', async (req, res) => {
    try {
        const updatedAccount = await accountController.updateAccountById(req.params.id, req.body);
        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Could not update account' });
    }
});

// Route to delete an account
router.delete('/accounts/:id', async (req, res) => {
    try {
        const deletedAccount = await accountController.deleteAccountById(req.params.id);
        res.json(deletedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Could not delete account' });
    }
});

module.exports = router;