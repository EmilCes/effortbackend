const router = require('express').Router();
const users = require('../controllers/users.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/users
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), users.getAll);

// GET: api/users/username
router.get('/:username', Authorize('Admin,BodyBuilder,Trainer'),  users.get);

// POST: api/users
router.post('/', users.create);

// PUT: api/users/username
router.put('/:username', Authorize('Admin,BodyBuilder,Trainer'), users.update);

// DELETE: api/users/username
router.delete('/:username', Authorize('Admin,BodyBuilder,Trainer'), users.delete);

// GET: api/users/:username/dailyroutines
router.get('/:username/dailyroutines', users.getDailyRoutines);

// POST: api/users/:username/dailyroutines/:routineId
router.post('/:username/dailyroutines/:routineId', users.addDailyRoutine);

// POST: api/users/:userId/files/:fileId
router.post('/:username/files/:fileId', users.addFile);

// PUT: api/users/:userId/files/:fileId
router.put('/:userId/files/:fileId', users.updateFile);

module.exports = router;