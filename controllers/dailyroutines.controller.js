const { where } = require('sequelize');
const { dailyroutine, exercise, user, muscle} = require('../models')
let self = {}

// GET: api/dailyroutines
self.getAll = async function (req, res) {
    try {
        const { s } = req.query;

        const filters = {};
        if (s) {
            filters.name = {
                [Op.like]: `%${s}%`
            }
        }

        let data = await dailyroutine.findAll({
            where: filters,
            attributes: ['routineId', 'name'],
        });

        const response = {
            'routines': data
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(data);
    }
}

// GET: api/dailyroutines/:routineId
self.get = async function (req, res) {
    try {
        let { routineId } = req.params;
        let dailyRoutine = await dailyroutine.findByPk(routineId, {
            attributes: ['routineId', 'name'],
            include: [
                {
                    model: exercise,
                    as: 'exercises',
                    attributes: ['exerciseId', 'name', 'description', 'videoUrl'],
                    through: {
                        attributes: ['series', 'repetitions']
                    },
                    include: {
                        model: muscle,
                        as: 'muscles',
                        attributes: ['muscleId', 'muscleName'],
                        through: { attributes: [] } // Ensure that this excludes the through table attributes
                    }
                }
            ]

        });

        if (!dailyRoutine) {
            return res.status(404).json({ message: 'Daily routine not found.' });
        }

        res.status(200).json(dailyRoutine);
    } catch (error) {
        console.error('Error retrieving daily routine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// POST: api/dailyroutines
self.create = async function (req, res) {
    try {

        const data = await dailyroutine.create({
            name: req.body.name
        });

        return res.status(201).json({
            routineId: data.routineId,
            name: data.name,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

// POST: api/dailyroutines/:routineId/exercises
self.addExercises = async function (req, res) {
    try {
        const { exercises } = req.body;
        
        let dailyRoutineItem = await dailyroutine.findByPk(req.params.routineId);
        if (!dailyRoutineItem) {
            return res.status(404).send();
        }
        
        for (const { exerciseId, series, repetitions } of exercises) {
            const exerciseItem = await exercise.findByPk(exerciseId);
            if (!exerciseItem) {
                return res.status(404).send(`Exercise with id ${exerciseId} not found`);
            }
            const now = new Date();
            await dailyRoutineItem.addExercise(exerciseItem, { through: { series: series, repetitions: repetitions, createdAt: now, updatedAt: now } });
        }
        
        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json(error);
    }
};



module.exports = self;