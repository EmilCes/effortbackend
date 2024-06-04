const router = require('express').Router();
const weeklyroutines = require('../controllers/weeklyroutines.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/weeklyroutines/users/username
router.get('/users/:username', Authorize('Admin,BodyBuilder,Trainer'), weeklyroutines.get);

// POST: api/weeklyroutines
router.post('/', Authorize('Admin,BodyBuilder,Trainer'), weeklyroutines.create);

// PUT: api/weeklyroutines/weeklyroutineId
router.put('/:weeklyroutineId', Authorize('Admin,BodyBuilder,Trainer'), weeklyroutines.update);

// POST: api/weeklyroutines/weeklyroutineId/users/:username
router.post('/:weeklyroutineId/users/:username', Authorize('Admin,BodyBuilder,Trainer'), weeklyroutines.update);

module.exports = router;