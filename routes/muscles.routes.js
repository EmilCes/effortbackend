const router = require('express').Router();
const muscles = require('../controllers/muscles.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/muscles
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), muscles.getAll);

// GET: api/muscles/muscleId
router.get('/:muscleId', Authorize('Admin,BodyBuilder,Trainer'),  muscles.get);

// POST: api/muscles
router.post('/', muscles.create);

// PUT: api/muscles/muscleId
router.put('/:muscleId', Authorize('Admin,BodyBuilder,Trainer'), muscles.update);

// DELETE: api/muscles/muscleId
router.delete('/:muscleId', Authorize('Admin,BodyBuilder,Trainer'), muscles.delete);

module.exports = router;