const router = require('express').Router();
const dailyroutines = require('../controllers/dailyroutines.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/dailyroutines/routineId
router.get('/:routineId', dailyroutines.get);

module.exports = router;
