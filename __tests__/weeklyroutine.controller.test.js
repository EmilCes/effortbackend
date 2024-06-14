const app = require('../index');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const { weeklyroutine, weeklydailyroutine, dailyroutine, user } = require('../models');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const { GenerateToken } = require('../services/jwttoken.service');

let testUserCounter = 1;
let testRoutineCounter = 1;

let USER_ID;
let ROUTINE_ID;
let TOKEN;

async function insertTestUser() {
    const username = `testuser${testUserCounter}`;
    try {
        const newUser = await user.create({
            userId: crypto.randomUUID(),
            username: username,
            name: username,
            lastname: username,
            dateOfBirth: '1990-04-20',
            userTypeId: '8ff1d8c8-f0de-486e-a64a-b97c07bed950',
            email: `${username}@example.com`,
            password: 'testpassword',
        });

        USER_ID = newUser.userId;
        testUserCounter++;

    } catch (error) {
        console.error('Error inserting test user:', error);
    }
}

async function insertTestRoutine() {
    const routineName = `testroutine${testRoutineCounter}`;
    try {
        const newRoutine = await dailyroutine.create({
            name: routineName,
            userId: USER_ID,
        });

        ROUTINE_ID = newRoutine.routineId;
        testRoutineCounter++;
    } catch (error) {
        console.error('Error inserting test routine:', error);
    }
}

beforeAll(async () => {
    await insertTestUser();
    await insertTestRoutine();
    TOKEN = GenerateToken('testuser1@example.com', 'testpassword', 'Admin');
});

afterAll(async () => {
    await weeklyroutine.destroy({ where: { name: { [Sequelize.Op.like]: 'testroutine%' } } });
    await user.destroy({ where: { username: { [Sequelize.Op.like]: 'testuser%' } } });
});

describe("GET /api/weeklyroutines/users/:username", function () {
    test("TestObtenerRutinaSemanalPorUsuarioNoExistente", async () => {
        const response = await request(app).get(`/api/weeklyroutines/users/nonexistentuser`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/weeklyroutines", function () {
    test("TestCrearRutinaSemanal", async () => {
        const requestObj = {
            name: "Nueva Rutina Semanal",
            routines: { "Monday": ROUTINE_ID },
            userId: USER_ID
        };

        const response = await request(app).post(`/api/weeklyroutines`).set('Authorization', `Bearer ${TOKEN}`).send(requestObj);
        expect(response.status).toBe(responseCodes.CREATED);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.weeklyroutineId).toBeDefined();
        expect(response.body.name).toBe(requestObj.name);
    });
});

describe("PUT /api/weeklyroutines/:weeklyroutineId", function () {
    test("TestActualizarRutinaSemanalNoExistente", async () => {
        const requestObj = {
            name: "Rutina Semanal Actualizada",
            routines: { "Monday": ROUTINE_ID }
        };

        const response = await request(app).put(`/api/weeklyroutines/nonexistentroutine`).set('Authorization', `Bearer ${TOKEN}`).send(requestObj);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/weeklyroutines/:weeklyroutineId/users/:username", function () {
    test("TestAsociarUsuarioARutinaSemanalNoExistente", async () => {
        const response = await request(app).post(`/api/weeklyroutines/nonexistentroutine/users/testuser1`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestAsociarUsuarioARutinaSemanalUsuarioNoExistente", async () => {
        const response = await request(app).post(`/api/weeklyroutines/${ROUTINE_ID}/users/nonexistentuser`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});
