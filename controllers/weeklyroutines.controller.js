const { weeklyroutine, weeklydailyroutine, dailyroutine } = require('../models');

let self = {}

// GET: api/weeklyroutines/weeklyroutineId
self.get = async function (req, res) {
    try {
        const { weeklyroutineId } = req.params;
        let weeklyRoutine = await weeklyroutine.findByPk(weeklyroutineId);

        if (!weeklyRoutine) {
            return res.status(404).json({ message: 'Daily routine not found.' });
        }

        const weeklyDailyRoutines = await weeklydailyroutine.findAll({
            where: { weeklyroutineId: weeklyroutineId },
            include: [dailyroutine]
        });

        const result = {
            weeklyroutineId: weeklyRoutine.weeklyroutineId,
            name: weeklyRoutine.name,
            userId: weeklyRoutine.userId,
            routines: {
                "Monday": "",
                "Tuesday": "",
                "Wednesday": "",
                "Thursday": "",
                "Friday": "",
                "Saturday": "",
                "Sunday": ""
            }            
        };

        weeklyDailyRoutines.forEach(wdr => {
            result.routines[wdr.day] = wdr.dailyroutine.routineId;
        })

        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving weekly routine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// POST: api/weeklyroutines
self.create = async function (req, res) {
    try {
        const { name, routines, userId } = req.body;

        const validRoutines = Object.entries(routines).filter(([day, routineId]) => routineId);

        const weeklyDailyRoutines = validRoutines.map(([day, routineId]) => ({
            routineId,
            day
        }));

        const newWeeklyRoutine = await weeklyroutine.create({
            weeklyroutineId: crypto.randomUUID(),
            name,
            userId,
        });

        await weeklydailyroutine.bulkCreate(
            weeklyDailyRoutines.map(routine => ({
                weeklyroutineId: newWeeklyRoutine.weeklyroutineId,
                dailyroutineId: routine.routineId,
                day: routine.day,
            }))
        );

        res.status(201).json({ message: 'Weekly routine created succesfully.'} );
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

        const validRoutines = Object.entries(routines).filter(([day, dailyroutineId]) => dailyroutineId);
        const newWeeklyDailyRoutines = validRoutines.map(([day, dailyroutineId]) => ({
            dailyroutineId,
            day
        }));

        const existingWeeklyDailyRoutines = await weeklydailyroutine.findAll({
            where: { weeklyroutineId: weeklyroutineId }
        });

        const existingPairs = new Set(existingWeeklyDailyRoutines.map(wdr => `${wdr.dailyroutineId}-${wdr.day}`));
        const newPairs = new Set(newWeeklyDailyRoutines.map(wdr => `${wdr.dailyroutineId}-${wdr.day}`));

        for (const wdr of existingWeeklyDailyRoutines) {
            const pair = `${wdr.dailyroutineId}-${wdr.day}`;
            if (!newPairs.has(pair)) {
                await wdr.destroy();
            }
        }

        for (const { dailyroutineId, day } of newWeeklyDailyRoutines) {
            const pair = `${dailyroutineId}-${day}`;
            if (!existingPairs.has(pair)) {
                await weeklydailyroutine.create({
                    weeklyroutineId: weeklyroutineId,
                    dailyroutineId: dailyroutineId,
                    day: day
                });
            }
        }

        res.status(200).json({ message: 'Weekly routine updated successfully.' });
    } catch (error) {
        console.error('Error updating weekly routine:', error);
        res.status(500).json({ message: 'Internal server error'})
    }
}

module.exports = self;