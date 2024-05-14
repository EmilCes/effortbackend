const router = require('express').Router();
const userTypes = require('../controllers/userTypes.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET: api/auth
router.get('/', Authorize('Admin'), userTypes.getAll);

module.exports = router;