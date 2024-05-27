const { dailyroutine } = require('../models')
let self = {}

// GET: api/dailyroutines/:routineId
self.get = async function (req, res) {
    try {
        let { routineId } = req.params;
        let dailyRoutine = await dailyroutine.findByPk(routineId);

        if (!dailyRoutine) {
            return res.status(404).json({ message: 'Daily routine not found.' });
        }

        res.status(200).json(dailyRoutine);
    } catch (error) {
        console.error('Error retrieving daily routine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = self;