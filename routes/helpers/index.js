
// Here we can define helper functions shared across all routes, very convenient!

const sendRes = function(res, code, status, error) {
    res.status(code).send({
        status: status,
        error: error ? error : null
    });
}

module.exports = {
    sendRes
}