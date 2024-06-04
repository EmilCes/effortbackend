const router = require('express').Router()
const files = require('../controllers/files.controller')
const Authorize = require('../middlewares/auth.middleware')
const upload = require("../middlewares/upload.middleware")

// GET: api/files
router.get('/', Authorize('Admin,BodyBuilder,Trainer'), files.getAll);

// GET: api/files/5
router.get('/:fileId', Authorize('Admin,BodyBuilder,Trainer'), files.get);

// GET: api/files/5/details
router.get('/:fileId/details', Authorize('Admin,BodyBuilder,Trainer'), files.getDetalils);

// POST: api/files
router.post('/', Authorize('Admin,BodyBuilder,Trainer'), upload.single("file"), files.create);

// PUT: api/files/5
router.put('/:fileId', Authorize('Admin,BodyBuilder,Trainer'), upload.single("file"), files.update);

// DELETE: api/files/5
router.delete('/:fileId', Authorize('Admin,BodyBuilder,Trainer'), files.delete);

module.exports = router