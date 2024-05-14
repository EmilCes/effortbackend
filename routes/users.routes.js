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

module.exports = router;