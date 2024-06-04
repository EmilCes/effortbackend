const request = require('supertest');
const app = require('../index.js');
const { weeklyroutine, weeklydailyroutine, dailyroutine, user } = require('../models');

// Mock middleware
jest.mock('../middlewares/auth.middleware', () => () => (req, res, next) => next());

// Mock Sequelize models
jest.mock('../models', () => {
    const Sequelize = jest.requireActual('sequelize');
    const mockFindByPk = jest.fn();
    const mockSave = jest.fn();
    const mockSetUser = jest.fn();

    return {
        user: {
            findOne: jest.fn(),
        },
        weeklyroutine: {
            findOne: jest.fn(),
            findByPk: mockFindByPk,
            create: jest.fn().mockImplementation(data => ({
                ...data,
                save: mockSave,
                weeklyroutineId: '1',
            })),
        },
        weeklydailyroutine: {
            findAll: jest.fn(),
            bulkCreate: jest.fn(),
        },
        dailyroutine: {
            findOne: jest.fn(),
        },
        Sequelize: {
            col: jest.fn(colName => colName),
            Op: Sequelize.Op
        }
    };
});

describe('Weekly Routine Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/weeklyroutines/users/:username', () => {
        it('should return weekly routine by username', async () => {
            const foundUser = { userId: 1, username: 'user1' };
            const weeklyRoutine = {
                weeklyroutineId: '1',
                name: 'Routine 1',
                weeklydailyroutines: [
                    {
                        routineId: '1',
                        day: 'Monday',
                        dailyroutine: { routineId: '1', name: 'Daily Routine 1' }
                    }
                ]
            };

            user.findOne.mockResolvedValue(foundUser);
            weeklyroutine.findOne.mockResolvedValue(weeklyRoutine);

            const res = await request(app).get('/api/weeklyroutines/users/user1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                weeklyroutineId: '1',
                name: 'Routine 1',
                routines: [
                    {
                        day: 'Monday',
                        routineId: '1',
                        routineName: 'Daily Routine 1'
                    }
                ]
            });
        });

        it('should return 404 if user not found', async () => {
            user.findOne.mockResolvedValue(null);

            const res = await request(app).get('/api/weeklyroutines/users/nonexistent');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'User not found.' });
        });

        it('should return 404 if weekly routine not found', async () => {
            const foundUser = { userId: 1, username: 'user1' };

            user.findOne.mockResolvedValue(foundUser);
            weeklyroutine.findOne.mockResolvedValue(null);

            const res = await request(app).get('/api/weeklyroutines/users/user1');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'Weekly routine not found.' });
        });
    });

    describe('POST /api/weeklyroutines', () => {
        it('should create a new weekly routine', async () => {
            const newWeeklyRoutine = {
                weeklyroutineId: '1',
                name: 'Routine 1',
                userId: 1,
                save: jest.fn().mockResolvedValue(true)
            };
            const weeklyDailyRoutines = [
                { id: '1', weeklyroutineId: '1', routineId: '1', day: 'Monday' }
            ];

            weeklyroutine.create.mockResolvedValue(newWeeklyRoutine);
            weeklydailyroutine.bulkCreate.mockResolvedValue(weeklyDailyRoutines);

            const res = await request(app).post('/api/weeklyroutines').send({
                name: 'Routine 1',
                routines: { Monday: '1' },
                userId: 1
            });

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                weeklyroutineId: '1',
                name: 'Routine 1'
            });
        });

        it('should return 500 if error occurs during creation', async () => {
            weeklyroutine.create.mockRejectedValue(new Error('Error creating weekly routine'));

            const res = await request(app).post('/api/weeklyroutines').send({
                name: 'Routine 1',
                routines: { Monday: '1' },
                userId: 1
            });

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('PUT /api/weeklyroutines/:weeklyroutineId', () => {
        it('should update weekly routine', async () => {
            const weeklyRoutine = {
                weeklyroutineId: '1',
                name: 'Routine 1',
                save: jest.fn().mockResolvedValue(true)
            };
            const existingWeeklyDailyRoutines = [
                { routineId: '1', day: 'Monday', destroy: jest.fn() }
            ];

            weeklyroutine.findByPk.mockResolvedValue(weeklyRoutine);
            weeklydailyroutine.findAll.mockResolvedValue(existingWeeklyDailyRoutines);

            const res = await request(app).put('/api/weeklyroutines/1').send({
                name: 'Updated Routine',
                routines: { Tuesday: '2' }
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Weekly routine updated successfully.' });
            expect(weeklyRoutine.save).toHaveBeenCalled();
        });

        it('should return 404 if weekly routine not found', async () => {
            weeklyroutine.findByPk.mockResolvedValue(null);

            const res = await request(app).put('/api/weeklyroutines/1').send({
                name: 'Updated Routine',
                routines: { Tuesday: '2' }
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'Weekly routine not found.' });
        });
    });

    describe('POST /api/weeklyroutines/:weeklyroutineId/users/:username', () => {
        it('debe asociar un usuario con una rutina semanal exitosamente', async () => {
            const weeklyRoutine = {
                weeklyroutineId: '1',
                setUser: jest.fn().mockResolvedValue(true)
            };
            const foundUser = { userId: 1, username: 'user1' };

            weeklyroutine.findByPk.mockResolvedValue(weeklyRoutine);
            user.findOne.mockResolvedValue(foundUser);

            const res = await request(app).post('/api/weeklyroutines/1/users/user1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'User associated successfully.' });
            expect(weeklyRoutine.setUser).toHaveBeenCalledWith(foundUser.userId);
        });

        it('debe devolver 404 si no se encuentra la rutina semanal', async () => {
            weeklyroutine.findByPk.mockResolvedValue(null);

            const res = await request(app).post('/api/weeklyroutines/1/users/user1');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'Weekly routine not found.' });
        });

        it('debe devolver 404 si no se encuentra el usuario', async () => {
            const weeklyRoutine = { weeklyroutineId: '1' };

            weeklyroutine.findByPk.mockResolvedValue(weeklyRoutine);
            user.findOne.mockResolvedValue(null);

            const res = await request(app).post('/api/weeklyroutines/1/users/user1');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'User not found.' });
        });

        it('debe devolver 500 si ocurre un error en el servidor', async () => {
            weeklyroutine.findByPk.mockRejectedValue(new Error('Error inesperado'));

            const res = await request(app).post('/api/weeklyroutines/1/users/user1');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error' });
        });
    });
});

afterAll((done) => {
    app.close(done);
});
