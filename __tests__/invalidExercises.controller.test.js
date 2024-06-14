const app = require('../index');
const crypto = require('crypto');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const { user, exercise, Sequelize } = require('../models'); // Importamos el modelo user y Sequelize
const { GenerateToken } = require('../services/jwttoken.service');

let testUserCounter = 1;
let CREATOR_ID;

async function insertTestUser() {
    const username = `testuser${testUserCounter}`;
    try {
        CREATOR_ID = crypto.randomUUID(); // Actualizamos el CREATOR_ID
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

async function insertTestExercise() {
    try {
        const testExercise = {
            name: 'Test Exercise',
            description: 'Test Exercise Description',
            videoUrl: 'https://example.com/testvideo',
            creatorId: CREATOR_ID, // Usamos el CREATOR_ID generado
            isValid: false,
        };

        const newExercise = await exercise.create(testExercise);
        return newExercise;
    } catch (error) {
        console.error('Error insertando ejercicio de prueba:', error);
    }
}

let TOKEN = GenerateToken('emilianolezama@gmail.com', 'Cesarele23', 'Admin');

beforeAll(async () => {
    await insertTestUser();
    await insertTestExercise();
});

afterAll(async () => {
    await user.destroy({ where: { username: { [Sequelize.Op.like]: 'testuser%' } } });
    await exercise.destroy({ where: { name: 'Test Exercise' } });
});

describe("GET /api/invalidExercises", function () {
    test("TestObtenerEjerciciosInvalidos", async () => {
        const response = await request(app).get(`/api/invalidExercises`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.exercises).toBeDefined();
        expect(response.body.exercises.length).toBeGreaterThan(0);
    });

    test("TestObtenerEjerciciosInvalidosConFiltro", async () => {
        const response = await request(app).get(`/api/invalidExercises?s=Test`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.exercises).toBeDefined();
        expect(response.body.exercises.length).toBeGreaterThan(0);
    });
});

describe("GET /api/invalidExercises/:exerciseId", function () {
    test("TestObtenerEjercicioInvalido", async () => {
        const newExercise = await insertTestExercise();
        const response = await request(app).get(`/api/invalidExercises/${newExercise.exerciseId}`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.exerciseId).toBeDefined();
        expect(response.body.name).toBe('Test Exercise'); // Cambiamos testExercise.name por el valor esperado
    });

    test("TestObtenerEjercicioNoExistente", async () => {
        const response = await request(app).get(`/api/invalidExercises/nonexistent`).set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("PUT /api/invalidExercises/:exerciseId", function () {
    test("TestValidarEjercicio", async () => {
        const newExercise = await insertTestExercise();
        const response = await request(app)
            .put(`/api/invalidExercises/${newExercise.exerciseId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ isValid: true });
        expect(response.status).toBe(responseCodes.OK);
        expect(response.body.message).toBe("Ejercicio validado con éxito.");
    });

    test("TestEliminarEjercicio", async () => {
        const newExercise = await insertTestExercise();
        const response = await request(app)
            .put(`/api/invalidExercises/${newExercise.exerciseId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ isValid: false });
        expect(response.status).toBe(responseCodes.OK);
        expect(response.body.message).toBe("Ejercicio eliminado con éxito.");
    });

    test("TestValidarEjercicioNoExistente", async () => {
        const response = await request(app)
            .put(`/api/invalidExercises/1000`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ isValid: true });
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestEliminarEjercicioNoExistente", async () => {
        const response = await request(app)
            .put(`/api/invalidExercises/1000`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ isValid: false });
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestValidarEjercicioSinCampoIsValid", async () => {
        const newExercise = await insertTestExercise();
        const response = await request(app)
            .put(`/api/invalidExercises/${newExercise.exerciseId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({});
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
        expect(response.body.error).toBe("El campo 'isValid' es requerido.");
    });
});
