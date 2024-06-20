const { statistic, user } = require('../models');

let self = {};

// POST: api/statistics
self.create = async function (req, res) {
    try {
        const { day, time, username } = req.body;

        // Buscar el usuario por nombre de usuario
        const userFound = await user.findOne({
            where: { username: username }
        });

        if (!userFound) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Buscar si ya existe una estadística para la misma fecha y usuario
        let existingStatistic = await statistic.findOne({
            where: {
                day,
                userId: userFound.userId
            }
        });

        if (existingStatistic) {
            // Si existe, actualizar el registro existente
            existingStatistic = await existingStatistic.update({
                time: time
            });

            return res.status(200).json(existingStatistic);
        } else {
            // Si no existe, crear un nuevo registro
            const newStatistic = await statistic.create({
                day,
                time,
                userId: userFound.userId
            });

            return res.status(201).json(newStatistic);
        }

    } catch (error) {
        console.error('Error creating/updating statistic:', error);
        return res.status(500).send('Internal Server Error');
    }
}


// GET: api/statistics/:username
self.getByUsername = async function (req, res) {
    const { username } = req.params;

    try {
        const statistics = await statistic.findAll({
            where: { '$user.username$': username },
            include: [{
                model: user,
                as: 'user',
                attributes: []
            }],
            attributes: ['day', 'time'],
            raw: true
        });

        const response = {
            'statistics': statistics
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching statistics by username:', error);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = self;
