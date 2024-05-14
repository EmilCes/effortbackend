const errorLogger = (err, req, res, next) => {

    console.log(err.message);
    console.log(err.stackTrace);
    next(err);

};

module.exports = errorLogger;