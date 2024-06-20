const router = require('express').Router();
const statistics = require('../controllers/statistics.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/muscles
router.get('/:username', Authorize('Admin,BodyBuilder,Trainer'), statistics.getByUsername);

// POST: api/muscles
router.post('/', Authorize('Admin,BodyBuilder,Trainer'), statistics.create);

module.exports = router;