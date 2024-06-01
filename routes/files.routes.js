const router = require('express').Router()
const files = require('../controllers/files.controller')
const Authorize = require('../middlewares/auth.middleware')
const upload = require("../middlewares/upload.middleware")

// GET: api/files
router.get('/', files.getAll);

// GET: api/files/5
router.get('/:fileId', files.get);

// GET: api/files/5/details
router.get('/:fileId/details', files.getDetalils);

// POST: api/files
router.post('/', upload.single("file"), files.create);

// PUT: api/files/5
router.put('/:fileId', upload.single("file"), files.update);

// DELETE: api/files/5
router.delete('/:fileId', files.delete);

module.exports = router