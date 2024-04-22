const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Route to create a new group
router.post('/groups', async (req, res) => {
  try {
    const { name, description, deviceModels, proxies, script } = req.body;
    const newGroup = await groupController.createGroup(name, description, deviceModels, proxies, script);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all groups
router.get('/groups', async (req, res) => {
  try {
    const allGroups = await groupController.getAllGroups();
    res.json(allGroups);
  } catch (error) {
    console.error('Error retrieving groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get a group by ID
router.get('/groups/:groupId', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await groupController.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    console.error('Error retrieving group by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
