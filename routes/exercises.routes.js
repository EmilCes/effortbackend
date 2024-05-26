const router = require('express').Router();
const exercises = require('../controllers/exercises.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/exercises
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), exercises.getAll);

// GET: api/exercises/exerciseId
router.get('/:exerciseId', Authorize('Admin,BodyBuilder,Trainer'),  exercises.get);

// POST: api/exercises
router.post('/', Authorize('Admin,BodyBuilder,Trainer'), exercises.create);

// PUT: api/exercises/exerciseId
router.put('/:exerciseId', Authorize('Admin,BodyBuilder,Trainer'), exercises.update);

// DELETE: api/exercises/exerciseId
router.delete('/:exerciseId', Authorize('Admin,BodyBuilder,Trainer'), exercises.delete);

// POST: api/exercises/exerciseId/muscles
router.post('/:exerciseId/muscles', Authorize('Admin,BodyBuilder,Trainer'), exercises.addMuscles);

// POST: api/exercises/exerciseId/muscles
router.post('/:exerciseId/muscles', Authorize('Admin,BodyBuilder,Trainer'), exercises.addMuscles);

// PUT: api/exercises/exerciseId/muscles
router.put('/:exerciseId/muscles', Authorize('Admin,BodyBuilder,Trainer'), exercises.updateMuscles);

module.exports = router;