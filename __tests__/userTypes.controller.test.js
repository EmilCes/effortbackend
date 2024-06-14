const app = require('../index');
const request = require('supertest');
const responseCodes = require('../utils/responseCodes');
const { userType } = require('../models');
const { GenerateToken } = require('../services/jwttoken.service');

// Generar un token para las pruebas
const TOKEN = GenerateToken('usuario@example.com', 'contraseña', 'Admin');

describe("GET /api/userTypes", function () {
    test("Debería devolver los tres tipos de usuario", async () => {
        const response = await request(app)
            .get(`/api/userTypes`)
            .set('Authorization', `Bearer ${TOKEN}`);

        expect(response.status).toBe(responseCodes.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"));
        expect(response.body.length).toBe(3); // Verifica que haya tres tipos de usuario
    });
});
