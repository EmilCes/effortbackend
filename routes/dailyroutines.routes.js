const router = require('express').Router();
const { checkSchema } = require('express-validator');
const dailyroutines = require('../controllers/dailyroutines.controller');
const {createDailyRoutine, updateDailyRoutine, addExercisesToRoutineSchema, updateExercisesInRoutineSchema} = require('../schemas/dailyRoutine.schemas');
const Authorize = require('../middlewares/auth.middleware');
const validateFormat = require('../middlewares/validate.middleware');
const validateFields = require('../middlewares/validatepetitions.middleware');

// GET: api/dailyroutines/routineId
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.getAll);

// GET: api/dailyroutines/routineId
router.get('/:routineId', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.get);

// POST: api/dailyroutines
router.post('/', validateFields(createDailyRoutine()), checkSchema(createDailyRoutine()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.create);

// PUT: api/dailyroutines
router.put('/:routineId',validateFields(updateDailyRoutine()), checkSchema(updateDailyRoutine()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.update);

// POST: api/dailyroutines/routineId/exercises
router.post('/:routineId/exercises', validateFields(addExercisesToRoutineSchema()), checkSchema(addExercisesToRoutineSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.addExercises);

// PUT: api/dailyroutines/:routineId/exercises
router.put('/:routineId/exercises', validateFields(updateExercisesInRoutineSchema()), checkSchema(updateExercisesInRoutineSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.updateExercises);

module.exports = router;
