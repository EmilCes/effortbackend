const app = require('../index');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
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
          password: await bcrypt.hash('testpassword', 10), // Hash de la contraseña
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

describe("POST /api/auth", function() {
    test("TestInicioSesionExito", async () => {
        const credentials = {
            email: "testuser1@example.com",
            password: "testpassword"
        };
        const response = await request(app).post("/api/auth").send(credentials);
        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.email).toBe(credentials.email);
        expect(response.body.username).toBe("testuser1");
    });

    test("TestInicioSesionCredencialesIncorrectas", async () => {
        const credentials = {
            email: "testuser1@example.com",
            password: "incorrectpassword"
        };
        const response = await request(app).post("/api/auth").send(credentials);
        expect(response.status).toBe(responseCodes.UNAUTHORIZED);
    });

    test("TestInicioSesionUsuarioNoExistente", async () => {
        const credentials = {
            email: "nonexistentuser@example.com",
            password: "testpassword"
        };
        const response = await request(app).post("/api/auth").send(credentials);
        expect(response.status).toBe(responseCodes.UNAUTHORIZED);
    });
});