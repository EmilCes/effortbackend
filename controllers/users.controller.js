const { user, userType, Sequelize } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

let self = {};

// GET: api/users
self.getAll = async function (req, res) {
    const data = await user.findAll({
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

    return res.status(200).json(data);
}


// GET: api/users/username
self.get = async function (req, res) {
    const username = req.params.username;
    const data = await user.findOne({
        where: { username: username },
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

    if (data)
        return res.status(200).json(data);

    return res.status(404).send();
}

// POST: api/users
self.create = async function (req, res) {
    try {
        const userTypeInstance = await userType.findOne({ where: { description: req.body.userType } });

        const data = await user.create({
            userId: crypto.randomUUID(),
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            username: req.body.username,
            name: req.body.name,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            weight: req.body.weight,
            height: req.body.height,
            dateOfBirth: req.body.dateOfBirth,
            userTypeId: userTypeInstance.userTypeId // Cambia userType a userTypeInstance
        });


        return res.status(201).json({
            id: data.id,
            email: data.email,
            username: data.username,
            name: data.name,
            middlename: data.middlename,
            lastname: data.lastname,
            weight: data.weight,
            height: data.height,
            dateOfBirth: data.dateOfBirth,
            userType: userTypeInstance.description // Cambia userType a userTypeInstance
        });
    } catch (error) {
        console.log(error);
    }
}


// PUT: api/users/username
self.update = async function (req, res) {
    const username = req.params.username;
    const userTypeInstance = await userType.findOne({ where: { description: req.body.userType } });

    req.body.userTypeId = userTypeInstance.userTypeId;

    const data = await user.update(req.body, {
        where: { username: username }
    });

    if (data[0] === 0)
        return res.status(404).send();
    else
        return res.status(204).send();
}

// DELETE: api/users/username
self.delete = async function (req, res) {
    const username = req.params.username;
    let data = await user.findOne({ where: { username: username } });

    data = await user.destroy({ where: { username: username } });
    if (data === 1) return res.status(204).send();

    return res.status(400).send();
}

module.exports = self;


