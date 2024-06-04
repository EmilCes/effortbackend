const { where } = require('sequelize');
const { weeklyroutine, weeklydailyroutine, dailyroutine, user } = require('../models');
const crypto = require('crypto');

let self = {}

// GET: api/weeklyroutines/users/username
self.get = async function (req, res) {
    try {
        const { username } = req.params;

        let foundUser = await user.findOne({
            where: { username: username }
        });

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let weeklyRoutine = await weeklyroutine.findOne({
            where: { userId: foundUser.userId },
            include: [
                {
                    model: weeklydailyroutine,
                    attributes: ['routineId', 'day'],
                    include: [
                        {
                            model: dailyroutine,
                            attributes: ['routineId', 'name']
                        }
                    ]
                }
            ]
        });

        if (!weeklyRoutine) {
            return res.status(404).json({ message: 'Weekly routine not found.' });
        }

        const formattedResponse = {
            weeklyroutineId: weeklyRoutine.weeklyroutineId,
            name: weeklyRoutine.name,
            routines: weeklyRoutine.weeklydailyroutines.map(wdr => ({
                day: wdr.day,
                routineId: wdr.routineId,
                name: wdr.dailyroutine ? wdr.dailyroutine.name : null
            }))
        };

        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error('Error retrieving weekly routine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// POST: api/weeklyroutines
self.create = async function (req, res) {
    try {
        const { name, routines, userId } = req.body;

        const newWeeklyRoutine = await weeklyroutine.create({
            weeklyroutineId: crypto.randomUUID(),
            name,
            userId,
        });

        const weeklyDailyRoutines = [];

        for (const [day, routineId] of Object.entries(routines)) {
            if (routineId) {
                weeklyDailyRoutines.push({
                    id: crypto.randomUUID(),
                    weeklyroutineId: newWeeklyRoutine.weeklyroutineId,
                    routineId: routineId,
                    day: day,
                });
            }
        }

        await weeklydailyroutine.bulkCreate(weeklyDailyRoutines);

        res.status(201).json({
            weeklyroutineId: newWeeklyRoutine.weeklyroutineId,
            name: newWeeklyRoutine.name,
        });
    } catch (error) {
        console.error('Error creating weekly routine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// PUT: api/weeklyroutines/weeklyroutineId
self.update = async function (req, res) {
    try {
        const { weeklyroutineId } = req.params;
        const { name, routines } = req.body;

        const weeklyRoutine = await weeklyroutine.findByPk(weeklyroutineId);

        if (!weeklyRoutine) {
            return res.status(404).json({ message: 'Weekly routine not found.' });
        }

        weeklyRoutine.name = name;
        await weeklyRoutine.save();

        const existingWeeklyDailyRoutines = await weeklydailyroutine.findAll({
            where: { weeklyroutineId: weeklyroutineId }
        });

        const existingPairs = new Set(existingWeeklyDailyRoutines.map(wdr => `${wdr.routineId}-${wdr.day}`));
        const newPairs = new Set(Object.entries(routines).map(([day, routineId]) => `${routineId}-${day}`));

        for (const wdr of existingWeeklyDailyRoutines) {
            const pair = `${wdr.routineId}-${wdr.day}`;
            if (!newPairs.has(pair)) {
                await wdr.destroy();
            }
        }

        const newWeeklyDailyRoutines = [];

        for (const [day, routineId] of Object.entries(routines)) {
            if (!existingPairs.has(`${routineId}-${day}`)) {
                newWeeklyDailyRoutines.push({
                    id: crypto.randomUUID(),
                    weeklyroutineId: weeklyroutineId,
                    routineId: routineId,
                    day: day,
                });
            }
        }

        await weeklydailyroutine.bulkCreate(newWeeklyDailyRoutines);

        res.status(200).json({ message: 'Weekly routine updated successfully.' });
    } catch (error) {
        console.error('Error updating weekly routine:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// POST: api/weeklyroutines/weeklyroutineId/users/:username
self.associateUser = async function (req, res) {
    try {
        const { weeklyroutineId, username } = req.params;

        const weeklyRoutine = await weeklyroutine.findByPk(weeklyroutineId);

        if (!weeklyRoutine) {
            return res.status(404).json({ message: 'Weekly routine not found.' });
        }

        const user = await user.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await weeklyRoutine.setUser(user.userId);

        res.status(200).json({ message: 'User associated successfully.' });
    } catch (error) {
        console.error('Error associating user with weekly routine:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
}


module.exports = self;
