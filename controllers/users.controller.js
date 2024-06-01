const { user, file, dailyroutine, userDailyRoutine, userType, Sequelize } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op, where } = require('sequelize');

let self = {};

// GET: api/users
self.getAll = async function (req, res) {

    const { s } = req.query;

    const filters = {};
    if (s) {
        filters.username = {
            [Op.like]: `%${s}%`
        }
    }

    let data = await user.findAll({
        where: filters,
        attributes: ['userId','username', [Sequelize.col('userType.description'), 'userType']],
        include: {
            model: userType,
            as: 'userType',
            attributes: [] // No se incluyen atributos adicionales del modelo userType
        }
    });

    const response = {
        'users': data
    }

    return res.status(200).json(response);
}


// GET: api/users/username
self.get = async function (req, res) {
    const username = req.params.username;
    const data = await user.findOne({
        where: { username: username },
        raw: true,
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'userTypeId', 'emailVerified', 'emailVerificationToken', 'password'],
            include: [[Sequelize.col('userType.description'), 'userType']]
        },
        include: [
            {
                model: userType,
                as: 'userType',
                attributes: []
            },
            {
                model: file,
                as: 'file',
                attributes: ['fileId']
            }
        ]
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
            userTypeId: userTypeInstance.userTypeId
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

    try {
        const userInstance = await user.findOne({ where: { username: username } });
        if (!userInstance) {
            return res.status(404).send({ message: "User not found" });
        }

        const allowedUpdates = ['email', 'username', 'bio', 'name', 'middlename', 'lastname', 'weight', 'height', 'dateOfBirth'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Verifica si hay algo que actualizar
        if (Object.keys(updates).length === 0) {
            return res.status(400).send({ message: "No valid fields provided for update" });
        }

        // Si se está actualizando el username, verifica si ya existe
        if (updates.username && updates.username !== username) {
            const existingUser = await user.findOne({ where: { username: updates.username } });
            if (existingUser) {
                return res.status(400).send({ message: "Username already exists" });
            }
        }

        const [updated] = await user.update(updates, {
            where: { username: username }
        });

        if (updated === 0) {
            return res.status(404).send({ message: "User not updated" });
        } else {
            return res.status(204).send();
        }
    } catch (error) {
        console.log("Error:", error); // Log the error for debugging

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).send({
                message: "Validation error",
                details: error.errors.map(e => ({
                    message: e.message,
                    path: e.path,
                    value: e.value
                }))
            });
        } else {
            return res.status(500).send({ message: error.message });
        }
    }
}



// DELETE: api/users/username
self.delete = async function (req, res) {
    const username = req.params.username;
    let data = await user.findOne({ where: { username: username } });

    data = await user.destroy({ where: { username: username } });
    if (data === 1) return res.status(204).send();

    return res.status(400).send();
}

// GET: api/dailyroutines/users/:username
self.getDailyRoutines = async function (req, res) {
    try {
        const username = req.params.username;
        const { s } = req.query;

        const existingUser = await user.findOne({ where: { username } });

        if (!existingUser)
            return res.status(404).json({ error: "Usuario no encontrado" });

        const userRoutines = await userDailyRoutine.findAll({
            where: { userId: existingUser.userId }
        });

        // Extraemos los IDs de las rutinas diarias asociadas con el usuario
        const routineIds = userRoutines.map(userRoutine => userRoutine.routineId);

        // Consultamos las rutinas diarias correspondientes a esos IDs
        const data = await dailyroutine.findAll({
            where: {
                routineId: routineIds,
                ...(s && { name: { [Op.like]: `%${s}%` } })
            },
            attributes: ['routineId', 'name']
        });

        const response = {
            "routines": data
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener rutinas: ", error);
        return res.status(500).json({ error: "Error al obtener rutinas: " });
    }
}



// POST: api/users/:username/dailyroutines/:routineId
self.addDailyRoutine = async function (req, res) {
    try {
        const username = req.params.username;
        const routineId = req.params.routineId;
        const isOwner = req.body.isOwner;

        const existingUser = await user.findOne({ where: {username: username} });
        const existingRoutine = await dailyroutine.findByPk(routineId);

        if (!existingUser) 
            return res.status(404).json({ error: "Usuario no encontrado" });

        if (!existingRoutine) 
            return res.status(404).json({ error: "Rutina no encontrado" });

        if(isOwner == null) 
            return res.status(400).send();

        const now = new Date();

        await existingUser.addDailyRoutine(existingRoutine,  { through: { creator: isOwner, createdAt: now, updatedAt: now } });

        return res.status(200).json({ message: "Rutina asociada correctamente" });

    } catch (error) {
        console.error("Error al asociar rutina al usuario:", error);
        return res.status(500).json({ error: "Error al asociar rutina al usuario" });
    }
}

// POST: api/users/:userId/files/:fileId
self.addFile = async function (req, res) {
    try {
        const username = req.params.username;
        const fileId = req.params.fileId;

        const existingUser = await user.findOne({ where: {username: username} });
        const existingFile = await file.findByPk(fileId);

        if (!existingUser) 
            return res.status(404).json({ error: "Usuario no encontrado" });

        if (!existingFile) 
            return res.status(404).json({ error: "Archivo no encontrado" });

        await existingUser.setFile(existingFile);

        return res.status(200).json({ message: "Archivo asociado correctamente" });

    } catch (error) {
        console.error("Error al asociar archivo al usuario:", error);
        return res.status(500).json({ error: "Error al asociar archivo al usuario" });
    }
}

// PUT: api/users/:userId/files/:fileId
self.updateFile = async function (req, res) {
    try {
        const userId = req.params.userId;
        const fileId = req.params.fileId;

        const existingUser = await user.findByPk(userId);
        const existingFile = await file.findByPk(fileId);
        if (!existingUser || !existingFile) {
            return res.status(404).json({ error: "Usuario o archivo no encontrado" });
        }

        await existingUser.setFile(existingFile);

        return res.status(200).json({ message: "Asociación entre usuario y archivo actualizada exitosamente" });

    } catch (error) {
        console.error("Error al actualizar asociación entre usuario y archivo:", error);
        return res.status(500).json({ error: "Error al actualizar asociación entre usuario y archivo" });
    }
}


module.exports = self;


