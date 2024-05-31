const router = require('express').Router();
const weeklyroutines = require('../controllers/weeklyroutines.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/weeklyroutines/weeklyroutineId
router.get('/:weeklyroutineId', weeklyroutines.get);

// POST: api/weeklyroutines
router.post('/', weeklyroutines.create);

// PUT: api/weeklyroutines/weeklyroutineId
router.put('/:weeklyroutineId', weeklyroutines.update);

module.exports = router;