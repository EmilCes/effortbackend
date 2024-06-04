
const validateFields = (schema) => {
    return (req, res, next) => {
        let bodyKeys = Object.keys(req.body);
        let allowedKeys = Object.keys(schema);
        let additionalKeys = bodyKeys.filter(key => !allowedKeys.includes(key));
        let missingKeys = allowedKeys.filter(key => !bodyKeys.includes(key));
        
        if (additionalKeys.length > 0) {
            return  res.status(400).json({
                success: false,
                code: 400,
                details: { error: `Additional properties not allowed: ${additionalKeys.join(', ')}`}
            });
        }

        if (missingKeys.length > 0) {
            return res.status(400).json({
                success: false,
                code: 400,
                details: { error: `Missing properties: ${missingKeys.join(', ')}` }
            });
        }

        next();
    }
}

module.exports = validateFields;