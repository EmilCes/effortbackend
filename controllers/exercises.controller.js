const { Op, where } = require('sequelize');
const { exercise, muscle, Sequelize } = require('../models');

let self = {};

// GET: api/exercises
self.getAll = async function (req, res) {
    try {
        const { s } = req.query;

        const filters = { isValid: true };
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


// GET: api/exercises/exerciseId
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
    
        if (data && data.isValid === true)
            return res.status(200).json(data);
        else
            return res.status(404).send();
    
    } catch (error) {
        return res.status(500).json(error);
    }   
}

// POST: api/exercises
self.create = async function (req, res) {
    try {

        const data = await exercise.create({
            name: req.body.name,
            description: req.body.description,
            videoUrl: req.body.videoUrl,
            creatorId: req.body.creatorId,
            isValid: false
        });

        return res.status(201).json({
            exerciseId: data.exerciseId,
            name: data.name,
            description: data.description,
            videoUrl: data.videoUrl,
            creatorId: data.creatorId
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


// PUT: api/exercises/exerciseId
self.update = async function (req, res) {
    try {
        const exerciseId = req.params.exerciseId;
        const body = req.body;

        body.isValid = false;

        const data = await exercise.update(body, { where: { exerciseId: exerciseId } });

        if (data[0] === 0)
            return res.status(404).send();
        else
            return res.status(204).send();

    } catch (error) {
        return res.status(500).json(error);
    }
}

// DELETE: api/exercises/exerciseId
self.delete = async function (req, res) {
    try {
        const exerciseId = req.params.exerciseId;
        let data = await exercise.findByPk(exerciseId);

        if (!data)
            return res.status(404).send();

        data = await exercise.destroy({ where: { exerciseId: exerciseId } })

        if (data === 1)
            return res.status(204).send();
        else
            return res.status(404).send();

    } catch (error) {
        return res.status(500).json(error);
    }
}

// POST: api/exercises/exerciseId/muscles
self.addMuscles = async function (req, res) {
    try {
        let musclesToAssign = await Promise.all(req.body.muscles.map(async ({ name }) => {
            const muscleToAssign = await muscle.findAll({ where: { muscleName: name }}); 
            return muscleToAssign[0]; // Solo tomamos la primera instancia de músculo encontrada
        }));

        let exerciseItem = await exercise.findByPk(req.params.exerciseId);
        if (!exerciseItem) return res.status(404).send();

        await exerciseItem.addMuscles(musclesToAssign);
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

// PUT: api/exercises/exerciseId/muscles
self.updateMuscles = async function (req, res) {
    try {
        let musclesToAssign = await Promise.all(req.body.muscles.map(async ({ name }) => {
            const muscleToAssign = await muscle.findAll({ where: { muscleName: name }}); 
            return muscleToAssign[0]; // Solo tomamos la primera instancia de músculo encontrada
        }));

        let exerciseItem = await exercise.findByPk(req.params.exerciseId);
        if (!exerciseItem) return res.status(404).send();

        
        await exerciseItem.setMuscles([]);

        await exerciseItem.addMuscles(musclesToAssign);
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


module.exports = self;


