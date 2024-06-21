const router = require('express').Router();
const follows = require('../controllers/follows.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/follows/:username/following
router.get('/:username/following', follows.getUserFollowing);

// GET: api/follows/:username/followers
router.get('/:username/followers', follows.getUserFollowers);

// POST: api/follows
router.post('/', Authorize('Admin,BodyBuilder,Trainer'), follows.addFollower);

// DELETE: api/follows
router.delete('/', Authorize('Admin,BodyBuilder,Trainer'), follows.removeFollower);

module.exports = router;