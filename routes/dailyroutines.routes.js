const router = require('express').Router();
const dailyroutines = require('../controllers/dailyroutines.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/dailyroutines/routineId
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.getAll);

// GET: api/dailyroutines/routineId
router.get('/:routineId', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.get);

// POST: api/dailyroutines
router.post('/', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.create);

// PUT: api/dailyroutines
router.put('/:routineId', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.update);

// POST: api/dailyroutines/routineId/exercises
router.post('/:routineId/exercises', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.addExercises);

// PUT: api/dailyroutines/:routineId/exercises
router.put('/:routineId/exercises', Authorize('Admin,BodyBuilder,Trainer'), dailyroutines.updateExercises);

module.exports = router;
