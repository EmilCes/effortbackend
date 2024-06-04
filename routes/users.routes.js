const router = require('express').Router();
const users = require('../controllers/users.controller');
const { checkSchema } = require('express-validator');
const {getUserByUsernameSchema, createUserSchema, updateUserSchema} = require('../schemas/users.schemas');
const Authorize = require('../middlewares/auth.middleware');
const validateFormat = require('../middlewares/validate.middleware');
const validateFields = require('../middlewares/validatepetitions.middleware');


// GET: api/users
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), users.getAll);

// GET: api/users/username
router.get('/:username', Authorize('Admin,BodyBuilder,Trainer'),  users.get);

// POST: api/users
router.post('/',validateFields(createUserSchema()), checkSchema(createUserSchema()), validateFormat ,users.create);

// PUT: api/users/username
router.put('/:username',validateFields(updateUserSchema()), checkSchema(updateUserSchema()), validateFormat, Authorize('Admin,BodyBuilder,Trainer'), users.update);

// DELETE: api/users/username
router.delete('/:username', Authorize('Admin,BodyBuilder,Trainer'), users.delete);

// GET: api/users/:username/dailyroutines
router.get('/:username/dailyroutines', Authorize('Admin,BodyBuilder,Trainer'), users.getDailyRoutines);

// POST: api/users/:username/dailyroutines/:routineId
router.post('/:username/dailyroutines/:routineId', Authorize('Admin,BodyBuilder,Trainer'), users.addDailyRoutine);

// POST: api/users/:userId/files/:fileId
router.post('/:username/files/:fileId', Authorize('Admin,BodyBuilder,Trainer'), users.addFile);

// PUT: api/users/:userId/files/:fileId
router.put('/:userId/files/:fileId', Authorize('Admin,BodyBuilder,Trainer'), users.updateFile);

module.exports = router;