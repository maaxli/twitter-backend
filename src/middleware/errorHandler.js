const errorHandler = (req, res, next, err) => {
    res.json({ error: "Unknown error occured!" });
}

module.exports = errorHandler;