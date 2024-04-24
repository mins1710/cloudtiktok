const Account = require('../models/accountModel');

// Create a new account
async function createAccount(accountData) {
    try {
        const newAccount = await Account.create(accountData);
        return newAccount;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}

 function convertAccounts(accountsString){
    try {

            const decodedString = Buffer.from(accountsString, 'base64').toString();
            const accountsArray = decodedString.split("\n");
            const accountObjects = accountsArray.map(account => {
                const accountParts = account.split('|').map(line => line);
                    return {
                        email: accountParts[0],
                        password: accountParts[1],
                    }
            });
            const validAccounts  = accountObjects.filter(account => account.email || account.password);
            console.log(validAccounts)
            return validAccounts;
        } catch (error) {
            throw new Error("Internal Server Error");
        }
    
}

// Get all accounts
async function getAllAccounts() {
    try {
        const accounts = await Account.find();
        return accounts;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
}

// Update an account by ID
async function updateAccountById(id, updates) {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(id, updates, { new: true });
        return updatedAccount;
    } catch (error) {
        console.error('Error updating account:', error);
        throw error;
    }
}

// Delete an account by ID
async function deleteAccountById(id) {
    try {
        const deletedAccount = await Account.findByIdAndDelete(id);
        return deletedAccount;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}

module.exports = {
    createAccount,
    getAllAccounts,
    updateAccountById,
    deleteAccountById,
    convertAccounts
};
