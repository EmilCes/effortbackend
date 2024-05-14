const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        // name of your api
        tittle: 'Effort Backend API',
        description: "Effort's API"
    },
    host: 'localhost:3000'
};

// Se generará un nuevo archivo con la documentación
const outputFile = './swagger-output.json';
const routes = ['./index.js'];

// Se genera la documentación
swaggerAutogen(outputFile, routes, doc);