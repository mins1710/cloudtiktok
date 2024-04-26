const Group = require('../models/groupModel');

// Function to create a new group
async function createGroup(name, description, deviceModels, proxies, script) {
  try {
    const newGroup = new Group({
      name,
      description,
      deviceModels,
      proxies,
      script
    });
    const savedGroup = await newGroup.save();
    return savedGroup;
  } catch (error) {
    throw error; // Forward the error to the caller
  }
}   

// Function to retrieve all groups
async function getAllGroups() {
  try {
    const groups = await Group.find();
    return groups;
  } catch (error) {
    throw error; // Forward the error to the caller
  }
}

// Function to retrieve a group by its ID
async function getGroupById(groupId) {
  try {
    const group = await Group.findById(groupId);
    return group;
  } catch (error) {
    throw error; // Forward the error to the caller
  }
}

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById
};
