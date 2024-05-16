const router = require('express').Router();
const usersVerification = require('../controllers/usersVerification.controller');
const Authorize = require('../middlewares/auth.middleware');

// POST: api/user-verification/email
router.post('/:email', usersVerification.sendEmail);

// POST: api/user-verification/email
router.get('/verified/:email', usersVerification.verifiedEmail);

// GET: api/user-verification/token
router.get('/:token', usersVerification.verifyEmail);

module.exports = router;