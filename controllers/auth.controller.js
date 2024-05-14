const bcrypt = require('bcrypt');
const { user, userType, Sequelize } = require('../models');
const { GenerateToken, RemainingTimeToken } = require('../services/jwttoken.service');

let self = {};

// POST: api/auth
self.login = async function (req, res) {
    const { email, password } = req.body;

    try{
        let data = await user.findOne({
            where: { email: email },
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'userTypeId'],
                include: [[Sequelize.col('userType.description'), 'userType']]
            },
            include: {
                model: userType,
                as: 'userType',
                attributes: []
            }
        });

        if (data === null)
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });

        const passwordMatch = await bcrypt.compare(password, data.password);

        if (!passwordMatch)
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });

        let token = GenerateToken(data.email, data.username, data.userType);

        return res.status(200).json({
            email: data.email,
            username: data.username,
            rol: data.userType,
            jwt: token
        });
    } catch (error) {
        return res.status(400).json();
    }
}

// GET: api/auth/tiempo
self.time = async function (req, res) {
    const time = RemainingTimeToken(req);

    if (time == null)
        return res.status(404).send();
    return res.status(200).send(time);
}

module.exports = self;

