const errorHandler = (err, req, res, next) => {
    res.json({ error: "Unknown error occured!" });
}

module.exports = errorHandler;