const request = require('supertest');
const app = require('../index.js');
const { user, userType, Sequelize } = require('../models');
const bcrypt = require('bcrypt');  

// Mock del middleware de autorización
jest.mock('../middlewares/auth.middleware', () => () => (req, res, next) => next());

// Mock de modelos Sequelize
jest.mock('../models', () => {
    const Sequelize = jest.requireActual('sequelize');
    return {
      user: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
      },
      userType: {
        findOne: jest.fn()
      },
      Sequelize: {
        col: jest.fn((colName) => colName),
        Op: Sequelize.Op // Puedes agregar otras propiedades si es necesario
      }
    };
  });

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const users = [
        { userId: 1, username: 'user1', userType: 'admin' },
        { userId: 2, username: 'user2', userType: 'user' }
      ];

      user.findAll.mockResolvedValue(users);

      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ users });
    });
  });

  describe('GET /api/users/:username', () => {
    it('should return user by username', async () => {
      const userData = { userId: 1, username: 'user1', userType: 'admin' };

      user.findOne.mockResolvedValue(userData);

      const res = await request(app).get('/api/users/user1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(userData);
    });

    it('should return 404 if user not found', async () => {
      user.findOne.mockResolvedValue(null);

      const res = await request(app).get('/api/users/nonexistent');

      expect(res.statusCode).toBe(404);
    });
  });

  it('should create a new user', async () => {
    const userTypeInstance = { userTypeId: 1, description: 'admin' };
    const newUser = {
      userId: '123',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'newuser',
      name: 'John',
      middlename: 'Doe',
      lastname: 'Smith',
      weight: 70,
      height: 170,
      dateOfBirth: '1990-01-01',
      userTypeId: 1
    };
  
    userType.findOne.mockResolvedValue(userTypeInstance);
    user.create.mockResolvedValue(newUser);
  
    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        username: 'newuser',
        name: 'John',
        middlename: 'Doe',
        lastname: 'Smith',
        weight: 70,
        height: 170,
        dateOfBirth: '1990-01-01',
        userType: 'admin'
      });
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      email: newUser.email,
      username: newUser.username,
      name: newUser.name,
      middlename: newUser.middlename,
      lastname: newUser.lastname,
      weight: newUser.weight,
      height: newUser.height,
      dateOfBirth: newUser.dateOfBirth,
      userType: 'admin'
    });
  });
  

  describe('PUT /api/users/:username', () => {
    it('should update user', async () => {
      // Simular que el usuario ya existe en la base de datos
      const existingUser = {
        userId: '123',
        email: 'test@example.com',
        password: 'hashedpassword',
        username: 'user1',
        name: 'John',
        middlename: 'Doe',
        lastname: 'Smith',
        weight: 70,
        height: 170,
        dateOfBirth: '1990-01-01',
        userTypeId: 1
      };
      user.findOne.mockResolvedValue(existingUser);
  
      const updatedUser = {
        email: 'updated@example.com'
      };
  
      user.update.mockResolvedValue([1]);
  
      const res = await request(app)
        .put('/api/users/user1')
        .send(updatedUser);
  
      expect(res.statusCode).toBe(204);
    });
  
    it('should return 404 if user not found', async () => {
      // Simular que el usuario no existe en la base de datos
      user.findOne.mockResolvedValue(null);
  
      const res = await request(app)
        .put('/api/users/nonexistent')
        .send({ email: 'updated@example.com' });
  
      expect(res.statusCode).toBe(404);
    });
  });
  

  describe('DELETE /api/users/:username', () => {
    it('should delete user', async () => {
      user.destroy.mockResolvedValue(1);

      const res = await request(app).delete('/api/users/user1');

      expect(res.statusCode).toBe(204);
    });

    it('should return 400 if user not found', async () => {
      user.destroy.mockResolvedValue(0);

      const res = await request(app).delete('/api/users/nonexistent');

      expect(res.statusCode).toBe(400);
    });
  });
});

afterAll((done) => {
    app.close(done);
  });