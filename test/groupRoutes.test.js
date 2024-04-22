const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const groupRoutes = require('../routes/groupRoutes');
const groupController = require('../controllers/groupController');

jest.mock('../controllers/groupController');

const app = express();
app.use(bodyParser.json());
app.use('/api', groupRoutes);

describe('Group Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/groups', () => {
    test('should create a new group', async () => {
      const newGroup = {
        name: 'Test Group',
        description: 'Test Description',
        deviceModels: ['deviceModelId1', 'deviceModelId2'],
        proxies: ['proxyModelId1', 'proxyModelId2'],
        script: 'scriptModelId'
      };
      const createdGroup = {
        _id: '60d7a4b8c7c95e0018e5e3e9',
        ...newGroup,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      groupController.createGroup.mockResolvedValueOnce(createdGroup);
      const response = await request(app)
        .post('/api/groups')
        .send(newGroup);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdGroup);
    });

    test('should handle errors', async () => {
      const errorMessage = 'Internal server error';
      groupController.createGroup.mockRejectedValueOnce(new Error(errorMessage));
      const response = await request(app)
        .post('/api/groups')
        .send({});
      expect(response.status).toBe(500);
      expect(response.body.error).toBe(errorMessage);
    });
  });

  // Add tests for other routes (GET /api/groups, GET /api/groups/:groupId) similarly
});
