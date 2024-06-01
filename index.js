const express = require('express');
const dotenv = require('dotenv');
const app = express();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// Load .env configuration
dotenv.config();

// To understand JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use("/api/users", require('./routes/users.routes'));
app.use("/api/userTypes", require('./routes/userTypes.routes'));
app.use("/api/auth", require('./routes/auth.routes'));
app.use("/api/user-verification", require('./routes/usersVerification.routes'));
app.use("/api/muscles", require('./routes/muscles.routes'));
app.use("/api/exercises", require('./routes/exercises.routes'));
app.use('/api/dailyroutines', require('./routes/dailyroutines.routes'));
app.use('/api/weeklyroutines', require('./routes/weeklyroutines.routes'));
app.use('/api/files', require('./routes/files.routes'));

app.get("*", (req, res) => { res.status(404).send() });

// Middleware
const errorlogger = require('./middlewares/errorlogger.middleware');
const errorhandler = require('./middlewares/errorhandler.middleware');
app.use(errorlogger, errorhandler);


// Start web server  SERVER_PORT
const server = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Effort Backend listening: ${process.env.SERVER_PORT}`)
});

module.exports = server
