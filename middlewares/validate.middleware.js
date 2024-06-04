const { validationResult } = require('express-validator');

const validateFormat = (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            detalles: errors.array().map(error => error.msg)
        });
    } else {
        next();
    }
}

module.exports = validateFormat;