const request = require('supertest');
const app = require('../index.js');
const {dailyroutine, exercise, Sequelize } = require('../models');
const bcrypt = require('bcrypt');  

// Mock del middleware de autorización
jest.mock('../middlewares/auth.middleware', () => () => (req, res, next) => next());

jest.mock('../models', () => {
    const Sequelize = jest.requireActual('sequelize');
    return {
      dailyroutine: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        addExercise: jest.fn()
      },
      exercise: {
        findByPk: jest.fn()
      },
      Sequelize: {
        col: jest.fn((colName) => colName),
        Op: Sequelize.Op // Puedes agregar otras propiedades si es necesario
      }
    };
  });

  describe('DailyRoutine Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('GET /api/dailyroutines', () => {
        it('should return all daily routines', async () => {
          // Simular datos de rutinas diarias para la prueba
          const routines = [
            { routineId: 1, name: 'Routine 1' },
            { routineId: 2, name: 'Routine 2' }
          ];
          dailyroutine.findAll.mockResolvedValue(routines);
    
          const res = await request(app).get('/api/dailyroutines');
    
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual({ routines });
        });
    
        // Agregar más pruebas según sea necesario para probar los diferentes casos, como filtros y errores.
      });

      describe('GET /api/dailyroutines/:routineId', () => {
        it('should return a daily routine by ID', async () => {
          // Simular una rutina diaria para la prueba
          const dailyRoutine = { routineId: 1, name: 'Rutina diaria de prueba número 1', exercises: [] };
          dailyroutine.findByPk.mockResolvedValue(dailyRoutine);
    
          const res = await request(app).get('/api/dailyroutines/1');
    
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual(dailyRoutine);
        });
      });

      describe('POST /api/dailyroutines', () => {
        it('should create a new daily routine', async () => {
          // Simular los datos de entrada para la creación de la rutina diaria
          const newRoutineData = { name: 'New Routine' };
          const createdRoutine = { routineId: 1, name: 'New Routine' };
          dailyroutine.create.mockResolvedValue(createdRoutine);
    
          const res = await request(app)
            .post('/api/dailyroutines')
            .send(newRoutineData);
    
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual(createdRoutine);
        });
      });

      describe('PUT /api/dailyroutines/:routineId', () => {
        it('should update a daily routine', async () => {
          // Datos simulados para la solicitud PUT
          const existingRoutineData = { name: 'Rutina'};
          const updatedRoutineData = { name: 'Rutina actualizada' };
          const routineId = 2;
          const expectedRoutineId = "2";
      
          dailyroutine.findByPk.mockResolvedValue(existingRoutineData);

          // Mock de la función update de Sequelize
          dailyroutine.update.mockResolvedValue([1]); // Indica que se actualizó un registro
      
          const res = await request(app)
            .put(`/api/dailyroutines/${routineId}`)
            .send(updatedRoutineData);
      
          // Verificar el código de estado
          expect(res.statusCode).toBe(204);
      
          // Verificar que se llamó a la función update con los datos correctos
          expect(dailyroutine.update).toHaveBeenCalledWith(updatedRoutineData, {
            where: { routineId: expectedRoutineId }
          });
        });
      });
         
      
      describe('DailyRoutine Controller', () => {
        describe('POST /api/dailyroutines/:routineId/exercises', () => {
          it('should add exercises to a daily routine', async () => {
            const routineId = 1;
            const expectedRoutineId = "1";
            const exercisesData = [
              { exerciseId: 1, series: 3, repetitions: 10 },
              { exerciseId: 2, series: 4, repetitions: 8 },
            ];
            const dailyRoutineItem = {
              addExercise: jest.fn(),
            };
      
            const exercise1 = { id: 1 };
            const exercise2 = { id: 2 };
      
            dailyroutine.findByPk.mockResolvedValue(dailyRoutineItem);
            exercise.findByPk.mockImplementation((exerciseId) => {
              if (exerciseId === 1) return Promise.resolve(exercise1);
              if (exerciseId === 2) return Promise.resolve(exercise2);
              return Promise.resolve(null);
            });
      
            const res = await request(app)
              .post(`/api/dailyroutines/${routineId}/exercises`)
              .send({ exercises: exercisesData });
      
            expect(res.statusCode).toBe(204);
            expect(dailyroutine.findByPk).toHaveBeenCalledWith(expectedRoutineId);
            expect(exercise.findByPk).toHaveBeenNthCalledWith(1, 1);
            expect(exercise.findByPk).toHaveBeenNthCalledWith(2, 2);
            expect(dailyRoutineItem.addExercise).toHaveBeenCalledTimes(2);
            expect(dailyRoutineItem.addExercise).toHaveBeenNthCalledWith(
              1,
              exercise1,
              expect.objectContaining({
                through: expect.objectContaining({ series: 3, repetitions: 10 }),
              })
            );
          });
      
          it('should return 404 if the daily routine is not found', async () => {
            const routineId = 1;
            const exercisesData = [
              { exerciseId: 1, series: 3, repetitions: 10 },
              { exerciseId: 2, series: 4, repetitions: 8 },
            ];
      
            dailyroutine.findByPk.mockResolvedValue(null);
      
            const res = await request(app)
              .post(`/api/dailyroutines/${routineId}/exercises`)
              .send({ exercises: exercisesData });
      
            expect(res.statusCode).toBe(404);
          });
      
          it('should return 404 if any exercise is not found', async () => {
            const routineId = 1;
            const exercisesData = [
              { exerciseId: 1, series: 3, repetitions: 10 },
              { exerciseId: 3, series: 4, repetitions: 8 }, // exerciseId 3 does not exist
            ];
            const dailyRoutineItem = {
              addExercise: jest.fn(),
            };
      
            const exercise1 = { id: 1 };
      
            dailyroutine.findByPk.mockResolvedValue(dailyRoutineItem);
            exercise.findByPk.mockImplementation((exerciseId) => {
              if (exerciseId === 1) return Promise.resolve(exercise1);
              return Promise.resolve(null);
            });
      
            const res = await request(app)
              .post(`/api/dailyroutines/${routineId}/exercises`)
              .send({ exercises: exercisesData });
      
            expect(res.statusCode).toBe(404);
          });
      
          it('should return 500 if there is an internal server error', async () => {
            const routineId = 1;
            const exercisesData = [
              { exerciseId: 1, series: 3, repetitions: 10 },
              { exerciseId: 2, series: 4, repetitions: 8 },
            ];
      
            dailyroutine.findByPk.mockRejectedValue(new Error('Internal Server Error'));
      
            const res = await request(app)
              .post(`/api/dailyroutines/${routineId}/exercises`)
              .send({ exercises: exercisesData });
      
            expect(res.statusCode).toBe(500);
          });
        });
      });

      describe('PUT /api/dailyroutines/:routineId/exercises', () => {
        it('should update exercises for a daily routine', async () => {
          const routineId = '1';  // Convertido a cadena
          const exercisesData = [
            { exerciseId: 1, series: 3, repetitions: 10 },
            { exerciseId: 2, series: 4, repetitions: 8 },
          ];
          const dailyRoutineItem = {
            setExercises: jest.fn(),
            addExercise: jest.fn(),
          };
    
          const exercise1 = { id: 1 };
          const exercise2 = { id: 2 };
    
          dailyroutine.findByPk.mockResolvedValue(dailyRoutineItem);
          exercise.findByPk.mockImplementation((exerciseId) => {
            if (exerciseId === 1) return Promise.resolve(exercise1);
            if (exerciseId === 2) return Promise.resolve(exercise2);
            return Promise.resolve(null);
          });
    
          const res = await request(app)
            .put(`/api/dailyroutines/${routineId}/exercises`)
            .send({ exercises: exercisesData });
    
          expect(res.statusCode).toBe(204);
          expect(dailyroutine.findByPk).toHaveBeenCalledWith(routineId);
          expect(dailyRoutineItem.setExercises).toHaveBeenCalledWith([]);
          expect(exercise.findByPk).toHaveBeenNthCalledWith(1, 1);
          expect(exercise.findByPk).toHaveBeenNthCalledWith(2, 2);
          expect(dailyRoutineItem.addExercise).toHaveBeenCalledTimes(2);
          expect(dailyRoutineItem.addExercise).toHaveBeenNthCalledWith(
            1,
            exercise1,
            expect.objectContaining({
              through: expect.objectContaining({ series: 3, repetitions: 10 }),
            })
          );
        });
    
        it('should return 404 if the daily routine is not found', async () => {
          const routineId = '1';  // Convertido a cadena
          const exercisesData = [
            { exerciseId: 1, series: 3, repetitions: 10 },
            { exerciseId: 2, series: 4, repetitions: 8 },
          ];
    
          dailyroutine.findByPk.mockResolvedValue(null);
    
          const res = await request(app)
            .put(`/api/dailyroutines/${routineId}/exercises`)
            .send({ exercises: exercisesData });
    
          expect(res.statusCode).toBe(404);
        });
    
        it('should return 404 if any exercise is not found', async () => {
          const routineId = '1';  // Convertido a cadena
          const exercisesData = [
            { exerciseId: 1, series: 3, repetitions: 10 },
            { exerciseId: 3, series: 4, repetitions: 8 }, // exerciseId 3 does not exist
          ];
          const dailyRoutineItem = {
            setExercises: jest.fn(),
            addExercise: jest.fn(),
          };
    
          const exercise1 = { id: 1 };
    
          dailyroutine.findByPk.mockResolvedValue(dailyRoutineItem);
          exercise.findByPk.mockImplementation((exerciseId) => {
            if (exerciseId === 1) return Promise.resolve(exercise1);
            return Promise.resolve(null);
          });
    
          const res = await request(app)
            .put(`/api/dailyroutines/${routineId}/exercises`)
            .send({ exercises: exercisesData });
    
          expect(res.statusCode).toBe(404);
        });
    
        it('should return 500 if there is an internal server error', async () => {
          const routineId = '1';  // Convertido a cadena
          const exercisesData = [
            { exerciseId: 1, series: 3, repetitions: 10 },
            { exerciseId: 2, series: 4, repetitions: 8 },
          ];
    
          dailyroutine.findByPk.mockRejectedValue(new Error('Internal Server Error'));
    
          const res = await request(app)
            .put(`/api/dailyroutines/${routineId}/exercises`)
            .send({ exercises: exercisesData });
    
          expect(res.statusCode).toBe(500);
        });
      });
      
  });
  

  
  afterAll((done) => {
    app.close(done);
  });
  