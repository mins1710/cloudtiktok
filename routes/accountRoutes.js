const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const Account = require("../models/accountModel");


router.get('/account', async (req,res) => {
   try {
    const type = req.query.type;
    if (!type) return res.status(400).send("Please specify a type");
    const account = await Account.findOneAndUpdate({type: type, usedTikTok: false},{usedTikTok: true})
    if (!account) return res.status(400).send("No account found");
    return res.status(200).send(account);
   } catch (error) {
    return res.status(400).send(error.message);
   }
    
})
// Route to create a new account
router.post('/accounts', async (req, res) => {
    try {
        const newAccount = await accountController.createAccount(req.body);
        res.json(newAccount);
    } catch (error) {
        res.status(500).json({ error: 'Could not create account' });
    }
});

router.post("/accounts/import", async (req,res) => {
    try {
        const accounts =  accountController.convertAccounts(req.body.data);
        const type = req.body.type;
        const accountsData = accounts.map(account => ({...account, type: type}));
        await Account.insertMany(accountsData);
        return res.status(200).json({accounts: accounts});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error")
    }
})

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
