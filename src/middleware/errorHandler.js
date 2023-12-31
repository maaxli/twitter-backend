const errorHandler = (err, req, res, next) => {
    if (err) res.json(err);
}

module.exports = errorHandler;