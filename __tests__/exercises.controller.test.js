const app = require('../index');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const { exercise,user, Sequelize } = require('../models');
const crypto = require('crypto');
const { GenerateToken } = require('../services/jwttoken.service');

let testUserCounter = 1;
let TOKEN;

let USER_ID;

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
        USER_ID = newUser.userId; // Guardar el userId del usuario creado
        testUserCounter++;
    } catch (error) {
        console.error('Error insertando usuario de prueba:', error);
    }
}

async function insertTestExercises() {
    try {
        await exercise.bulkCreate([
            { name: 'Ejercicio 1', description: 'Descripción 1', videoUrl: 'http://example.com/1', creatorId: USER_ID, isValid: true },
            { name: 'Ejercicio 2', description: 'Descripción 2', videoUrl: 'http://example.com/2', creatorId: USER_ID, isValid: true },
            { name: 'Ejercicio 3', description: 'Descripción 3', videoUrl: 'http://example.com/3', creatorId: USER_ID, isValid: false }
        ]);
    } catch (error) {
        console.error('Error insertando ejercicios de prueba:', error);
    }
}

beforeAll(async () => {
    await insertTestUser();
    await insertTestExercises();
    TOKEN = GenerateToken('emilianolezama@gmail.com', 'Cesarele23', 'Admin');
});

afterAll(async () => {
    await user.destroy({ where: { username: { [Sequelize.Op.like]: 'testuser%' } } });
    await exercise.destroy({ where: { isValid: true } });
});

describe("GET /api/exercises", function () {
    test("TestObtenerTodosLosEjercicios", async () => {
        const response = await request(app).get("/api/exercises").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.exercises).toBeDefined();
    });
});

describe("GET /api/exercises/:exerciseId", function () {
    test("TestObtenerEjercicioPorId", async () => {
        const exercises = await exercise.findAll();
        const exerciseId = exercises[0].exerciseId;
        const response = await request(app).get(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.name).toBeDefined();
    });

    test("TestObtenerEjercicioPorIdInexistente", async () => {
        const response = await request(app).get("/api/exercises/999999").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/exercises", function () {
    test("TestCrearEjercicioExito", async () => {
        const peticion = {
            name: "Nuevo Ejercicio",
            description: "Descripción del nuevo ejercicio",
            videoUrl: "http://example.com/new",
            creatorId: USER_ID
        };
        const response = await request(app).post("/api/exercises").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.CREATED);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.name).toBe(peticion.name);
    });

    test("TestCrearEjercicioCamposFaltantes", async () => {
        const peticion = {
            name: "Nuevo Ejercicio"
        };
        const response = await request(app).post("/api/exercises").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
    });
});

describe("PUT /api/exercises/:exerciseId", function () {
    test("TestActualizarEjercicioInexistente", async () => {
        const peticion = {
            name: "Ejercicio Actualizado",
            description: "Descripción actualizada",
            videoUrl: "http://example.com/updated",
            creatorId: "userID"
        };
        const response = await request(app).put("/api/exercises/999999").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestActualizarEjercicioCamposInvalidos", async () => {
        const peticion = {
            invalidField: "invalid"
        };
        const response = await request(app).put("/api/exercises/1").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
    });
});

describe("DELETE /api/exercises/:exerciseId", function () {
    test("TestEliminarEjercicioExito", async () => {
        const exercises = await exercise.findAll();
        const exerciseId = exercises[0].exerciseId;
        const response = await request(app).delete(`/api/exercises/${exerciseId}`).set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NO_CONTENT);
    });

    test("TestEliminarEjercicioInexistente", async () => {
        const response = await request(app).delete("/api/exercises/999999").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});
