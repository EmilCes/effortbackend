const app = require('../index');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const { dailyroutine, exercise, user } = require('../models');
const crypto = require('crypto');
const { GenerateToken } = require('../services/jwttoken.service');
const Sequelize = require('sequelize');

let testRoutineCounter = 1;
let testExerciseCounter = 1;
let testUserCounter = 1;

let ROUTINE_ID;
let EXERCISE_ID;
let CREATOR_ID;


async function insertTestUser() {
  const username = `testuser${testUserCounter}`;
  try {
      CREATOR_ID = crypto.randomUUID();
      await user.create({
          userId: CREATOR_ID,
          username: username,
          name: username,
          lastname: username,
          dateOfBirth: '1990-04-20',
          userTypeId: '8ff1d8c8-f0de-486e-a64a-b97c07bed950',
          email: `${username}@example.com`,
          password: 'testpassword',
      });

      testUserCounter++;

  } catch (error) {
      console.error('Error insertando usuario de prueba:', error);
  }
}

async function insertTestRoutine() {
  const routineName = `testroutine${testRoutineCounter}`;
  try {
      const dailyRoutineCreated = await dailyroutine.create({
          name: routineName
      });
      ROUTINE_ID = dailyRoutineCreated.routineId;
      testRoutineCounter++;
  } catch (error) {
      console.error('Error insertando rutina de prueba:', error);
  }
}

async function insertTestExercise() {
  const exerciseName = `testexercise${testExerciseCounter}`;
  try {
      const exerciseCreated = await exercise.create({
          name: exerciseName,
          description: `Description for ${exerciseName}`,
          videoUrl: `http://example.com/${exerciseName}`,
          isValid: false,
          creatorId: CREATOR_ID
      });
      EXERCISE_ID = exerciseCreated.exerciseId;
      testExerciseCounter++;
  } catch (error) {
      console.error('Error insertando ejercicio de prueba:', error);
  }
}

beforeAll(async () => {
  await insertTestUser();
  await insertTestRoutine();
  await insertTestExercise();
});

afterAll(async () => {
  await user.destroy({ where: { name: { [Sequelize.Op.like]: 'testuser%' } } });
  await dailyroutine.destroy({ where: { name: { [Sequelize.Op.like]: 'testroutine%' } } });
  await exercise.destroy({ where: { name: { [Sequelize.Op.like]: 'testexercise%' } } });
});

const TOKEN = GenerateToken('emilianolezama@gmail.com', 'Cesarele23', 'Admin');

describe("GET /api/dailyroutines", function() {
    test("TestObtenerTodasLasRutinas", async () => {
        const response = await request(app).get("/api/dailyroutines").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.routines).toBeDefined();
    });

    test("TestObtenerRutinasConFiltro", async () => {
        const response = await request(app).get("/api/dailyroutines?s=testroutine1").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.routines).toBeDefined();
    });
});

describe("GET /api/dailyroutines/:routineId", function() {
    test("TestObtenerRutinaPorIdExito", async () => {
        const response = await request(app).get(`/api/dailyroutines/${ROUTINE_ID}`).set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.routineId).toBe(ROUTINE_ID);
    });

    test("TestObtenerRutinaPorIdInexistente", async () => {
        const response = await request(app).get("/api/dailyroutines/1000").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/dailyroutines", function() {
    test("TestCrearRutinaExito", async () => {
        const peticion = {
            name: "Nueva Rutina"
        };
        const response = await request(app).post("/api/dailyroutines").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.CREATED);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.name).toBe(peticion.name);
    });

    test("TestCrearRutinaCamposFaltantes", async () => {
        const peticion = {};
        const response = await request(app).post("/api/dailyroutines").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
    });
});

describe("PUT /api/dailyroutines/:routineId", function() {
    test("TestActualizarRutinaExito", async () => {
        const peticion = {
            name: "Nueva Rutina Actualizada"
        };
        const response = await request(app).put(`/api/dailyroutines/${ROUTINE_ID}`).set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NO_CONTENT);
    });

    test("TestActualizarRutinaInexistente", async () => {
        const peticion = {
            name: "Nueva Rutina Actualizada"
        };
        const response = await request(app).put("/api/dailyroutines/1000").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/dailyroutines/:routineId/exercises", function() {
    test("TestAgregarEjerciciosRutinaExito", async () => {
        const peticion = {
            exercises: [
                {
                    exerciseId: EXERCISE_ID,
                    series: 3,
                    repetitions: 10
                }
            ]
        };
        const response = await request(app).post(`/api/dailyroutines/${ROUTINE_ID}/exercises`).set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NO_CONTENT);
    });

    test("TestAgregarEjerciciosRutinaInexistente", async () => {
        const peticion = {
            exercises: [
                {
                    exerciseId: EXERCISE_ID,
                    series: 3,
                    repetitions: 10
                }
            ]
        };
        const response = await request(app).post("/api/dailyroutines/nonexistentroutine/exercises").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("PUT /api/dailyroutines/:routineId/exercises", function() {
    test("TestActualizarEjerciciosRutinaExito", async () => {
        const peticion = {
            exercises: [
                {
                    exerciseId: EXERCISE_ID,
                    series: 4,
                    repetitions: 12
                }
            ]
        };
        const response = await request(app).put(`/api/dailyroutines/${ROUTINE_ID}/exercises`).set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NO_CONTENT);
    });

    test("TestActualizarEjerciciosRutinaInexistente", async () => {
        const peticion = {
            exercises: [
                {
                    exerciseId: EXERCISE_ID,
                    series: 4,
                    repetitions: 12
                }
            ]
        };
        const response = await request(app).put("/api/dailyroutines/nonexistentroutine/exercises").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

