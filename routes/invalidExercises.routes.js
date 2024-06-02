const router = require('express').Router();
const invalidExercises = require('../controllers/invalidExercises.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/invalidExercises
router.get('/', Authorize('Admin,Trainer'), invalidExercises.getAll);

// GET: api/invalidExercises/exerciseId
router.get('/:exerciseId', Authorize('Admin,Trainer'),  invalidExercises.get);

// PUT: api/invalidExercises/exerciseId
router.put('/:exerciseId', Authorize('Admin,Trainer'), invalidExercises.validateExercise);

module.exports = router;