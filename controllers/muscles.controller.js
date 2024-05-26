const { muscle, Sequelize } = require('../models');

let self = {};

// GET: api/muscles
self.getAll = async function (req, res) {
    let data = await muscle.findAll({ attributes: ['muscleId', 'muscleName'] });

    return res.status(200).json(data);
}


// GET: api/muscles/muscleId
self.get = async function (req, res) {
    const muscleId = req.params.muscleId;
    const data = await muscle.findOne({
        where: { muscleId: muscleId },
        attributes: ['muscleId', 'muscleName']
    });

    if (data)
        return res.status(200).json(data);

    return res.status(404).send();
}

// POST: api/muscles
self.create = async function (req, res) {
    try {
        const data = await muscle.create({
            muscleName: req.body.muscleName
        });


        return res.status(201).json({
            muscleId: data.muscleId,
            muscleName: data.muscleName
        });
    } catch (error) {
        console.log(error);
    }
}


// PUT: api/muscles/muscleId
self.update = async function (req, res) {
    const muscleId = req.params.muscleId;

    const data = await muscle.update(req.body, {
        where: { muscleId: muscleId }
    });

    if (data[0] === 0)
        return res.status(404).send();
    else
        return res.status(204).send();
}

// DELETE: api/muscleId/muscleId
self.delete = async function (req, res) {
    const muscleId = req.params.muscleId;
    let data = await muscle.findOne({ where: { muscleId: muscleId } });

    data = await muscle.destroy({ where: { muscleId: muscleId } });
    if (data === 1) return res.status(204).send();

    return res.status(400).send();
}

module.exports = self;


