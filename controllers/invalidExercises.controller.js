const { Op, where } = require('sequelize');
const { exercise, muscle, Sequelize } = require('../models');

let self = {};

// GET: api/invalidExercises
self.getAll = async function (req, res) {
    try {
        const { s } = req.query;

        const filters = { isValid: false };
        if (s) {
            filters.name = {
                [Op.like]: `%${s}%`
            }
        }

        let data = await exercise.findAll({
            where: filters,
            attributes: ['exerciseId', 'name', 'description', 'videoUrl', 'creatorId'],
            include: {
                model: muscle,
                as: 'muscles',
                attributes: ['muscleId', 'muscleName'],
                through: { attributes: [] }
            }
        });

        const dataToReturn = {
            "exercises" : data
        }

        return res.status(200).json(dataToReturn);
    } catch (error) {
        return res.status(500).json(data);
    }
}


// GET: api/invalidExercises/exerciseId
self.get = async function (req, res) {
    try {
        const exerciseId = req.params.exerciseId;
        const data = await exercise.findByPk(exerciseId, {
            attributes: ['exerciseId', 'name', 'description', 'videoUrl', 'creatorId', 'isValid'],
            include: {
                model: muscle,
                as: 'muscles',
                attributes: ['muscleId', 'muscleName'],
                through: { attributes: [] }
            }
        });
    
        if (data && data.isValid === false)
            return res.status(200).json(data);
        else
            return res.status(404).send();
    
    } catch (error) {
        return res.status(500).json(error);
    }   
}


// PUT: api/invalidExercises/exerciseId
self.validateExercise = async function (req, res) {
    try {
        const exerciseId = req.params.exerciseId;
        const { isValid } = req.body;

        if (isValid == undefined) {
            return res.status(400).json({ error: "El campo 'isValid' es requerido." });
        }

        if (isValid) {
            const result = await exercise.update(
                { isValid: true },
                { where: { exerciseId } }
            );

            if (result[0] === 0) {
                return res.status(404).json({ error: "Ejercicio no encontrado." });
            }

            return res.status(200).json({ message: "Ejercicio validado con éxito." });
        } else {
            const result = await exercise.destroy({ where: { exerciseId } });

            if (result === 0) {
                return res.status(404).json({ error: "Ejercicio no encontrado." });
            }

            return res.status(200).json({ message: "Ejercicio eliminado con éxito." });
        }

    } catch (error) {
        return res.status(500).json(error);
    }
}



module.exports = self;


