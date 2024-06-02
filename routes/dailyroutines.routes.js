const router = require('express').Router();
const dailyroutines = require('../controllers/dailyroutines.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/dailyroutines/routineId
router.get('/', dailyroutines.getAll);

// GET: api/dailyroutines/routineId
router.get('/:routineId', dailyroutines.get);

// POST: api/dailyroutines
router.post('/', dailyroutines.create);

// PUT: api/dailyroutines
router.put('/:routineId', dailyroutines.update);

// POST: api/dailyroutines/routineId/exercises
router.post('/:routineId/exercises', dailyroutines.addExercises);

// PUT: api/dailyroutines/:routineId/exercises
router.put('/:routineId/exercises', dailyroutines.updateExercises);

module.exports = router;
