const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const Authorize = require('../middlewares/auth.middleware');

// POST: api/auth
router.post('/', auth.login);

// GET: api/auth/time
router.get('/time', Authorize('Admin,BodyBuilder,Trainer'), auth.time);

module.exports = router;