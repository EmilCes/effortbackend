const { userType } = require('../models');

let self = {};

// GET: api/userTypes
self.getAll = async function (req, res, next) {
    let data = await userType.findAll({ attributes: ['userTypeId', 'description'] });

    return res.status(200).json(data);
}

module.exports = self;