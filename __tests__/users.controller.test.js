const app = require('../index');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const crypto = require('crypto');
const { GenerateToken } = require('../services/jwttoken.service');
const { user, Sequelize } = require('../models');

let testUserCounter = 1;


async function insertTestUser() {
  const username = `testuser${testUserCounter}`;
  try {
      await user.create({
          userId: crypto.randomUUID(),
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

beforeAll(async () => {
  await insertTestUser();
});

afterAll(async () => {
  await user.destroy({ where: { username: { [Sequelize.Op.like]: 'testuser%' } } });
});


const TOKEN = GenerateToken('emilianolezama@gmail.com', 'Cesarele23', 'Admin');

describe("GET /api/users", function() {
    test("TestObtenerTodosLosUsuarios", async () => {
        const response = await request(app).get("/api/users?s=testuser1").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.users).toBeDefined();
    });

    test("TestObtenerUsuariosSinFiltro", async () => {
        const response = await request(app).get("/api/users").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.users).toBeDefined();
    });
});

describe("GET /api/users/:username", function() {
    test("TestObtenerUsuarioPorUsernameExito", async () => {
        const response = await request(app).get("/api/users/testuser1").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.username).toBe("testuser1");
    });

    test("TestObtenerUsuarioPorUsernameInexistente", async () => {
        const response = await request(app).get("/api/users/nonexistentuser").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/users", function() {
    test("TestCrearUsuarioExito", async () => {
        const peticion = {
            email: "testuser@example.com",
            password: "Password1",
            username: "testuser",
            name: "Test",
            lastname: "Example",
            dateOfBirth: "1990-01-01",
            userType: "BodyBuilder"
        };
        const response = await request(app).post("/api/users").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.CREATED);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.username).toBe(peticion.username);
    });

    test("TestCrearUsuarioCamposFaltantes", async () => {
        const peticion = {
            email: "testuser@example.com",
            password: "Password1",
            username: "testuser"
        };
        const response = await request(app).post("/api/users").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
    });
});

describe("PUT /api/users/:username", function() {
    test("TestActualizarUsuarioExito", async () => {
        const peticion = {
          "email": "testuser1@example.com",
          "username": "testuser1",
          "name": "John",
          "lastname": "Doe",
          "weight": 75.5,
          "height": 180,
          "bio": "de",
          "password": "dssdw",
          "dateOfBirth": "1990-12-01",
          "userType": "Admin"
        };

        const response = await request(app).put("/api/users/testuser1").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NO_CONTENT);
    });

    test("TestActualizarUsuarioInexistente", async () => {
        const peticion = {
          "email": "testuser1@example.com",
          "username": "testuser1",
          "name": "John",
          "lastname": "Doe",
          "weight": 75.5,
          "height": 180,
          "bio": "de",
          "password": "dssdw",
          "dateOfBirth": "1990-12-01",
          "userType": "Admin"
        };
        const response = await request(app).put("/api/users/nonexistentuser").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestActualizarUsuarioCamposInvalidos", async () => {
        const peticion = {
            invalidField: "invalid"
        };
        const response = await request(app).put("/api/users/testuser").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
    });
});

describe("DELETE /api/users/:username", function() {
    test("TestEliminarUsuarioExito", async () => {
        const response = await request(app).delete("/api/users/testuser").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NO_CONTENT);
    });

    test("TestEliminarUsuarioInexistente", async () => {
        const response = await request(app).delete("/api/users/nonexistentuser").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.BAD_REQUEST);
    });
});

describe("GET /api/dailyroutines/users/:username", function() {
    test("TestObtenerRutinasDiariasUsuarioInexistente", async () => {
        const response = await request(app).get("/api/dailyroutines/users/nonexistentuser").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/users/:username/dailyroutines/:routineId", function() {

    test("TestAsociarRutinaUsuarioInexistente", async () => {
        const peticion = { isOwner: true };
        const response = await request(app).post("/api/users/nonexistentuser/dailyroutines/1").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestAsociarRutinaRutinaInexistente", async () => {
        const peticion = { isOwner: true };
        const response = await request(app).post("/api/users/testuser/dailyroutines/9999").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("POST /api/users/:username/files/:fileId", function() {

    test("TestAsociarArchivoUsuarioInexistente", async () => {
        const response = await request(app).post("/api/users/nonexistentuser/files/1").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestAsociarArchivoArchivoInexistente", async () => {
        const response = await request(app).post("/api/users/testuser/files/9999").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});

describe("PUT /api/users/:userId/files/:fileId", function() {

    test("TestActualizarAsociacionArchivoUsuarioInexistente", async () => {
        const response = await request(app).put("/api/users/9999/files/1").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });

    test("TestActualizarAsociacionArchivoArchivoInexistente", async () => {
        const response = await request(app).put("/api/users/1/files/9999").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(responseCodes.NOT_FOUND);
    });
});
