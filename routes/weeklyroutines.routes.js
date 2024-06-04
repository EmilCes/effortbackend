const router = require('express').Router();
const weeklyroutines = require('../controllers/weeklyroutines.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/weeklyroutines/users/username
router.get('/users/:username', weeklyroutines.get);

// POST: api/weeklyroutines
router.post('/', weeklyroutines.create);

// PUT: api/weeklyroutines/weeklyroutineId
router.put('/:weeklyroutineId', weeklyroutines.update);

// POST: api/weeklyroutines/weeklyroutineId/users/:username
router.post('/:weeklyroutineId/users/:username', weeklyroutines.update);

module.exports = router;