const router = require('express').Router();
const { checkSchema } = require('express-validator');
const {createExcerciseSchema, updateExerciseSchema, musclesToExerciseSchema} = require('../schemas/excercises.schemas');
const exercises = require('../controllers/exercises.controller');
const Authorize = require('../middlewares/auth.middleware');
const validateFormat = require('../middlewares/validate.middleware');
const validateFields = require('../middlewares/validatepetitions.middleware');

// GET: api/exercises
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), exercises.getAll);

// GET: api/exercises/exerciseId
router.get('/:exerciseId', Authorize('Admin,BodyBuilder,Trainer'),  exercises.get);

// POST: api/exercises
router.post('/', validateFields(createExcerciseSchema()), checkSchema(createExcerciseSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), exercises.create);

// PUT: api/exercises/exerciseId
router.put('/:exerciseId', validateFields(updateExerciseSchema()), checkSchema(updateExerciseSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), exercises.update);

// DELETE: api/exercises/exerciseId
router.delete('/:exerciseId', Authorize('Admin,BodyBuilder,Trainer'), exercises.delete);

// POST: api/exercises/exerciseId/muscles
router.post('/:exerciseId/muscles',validateFields(musclesToExerciseSchema()), checkSchema(musclesToExerciseSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), exercises.addMuscles);

// PUT: api/exercises/exerciseId/muscles
router.put('/:exerciseId/muscles', validateFields(musclesToExerciseSchema()), checkSchema(musclesToExerciseSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), exercises.updateMuscles);

module.exports = router;