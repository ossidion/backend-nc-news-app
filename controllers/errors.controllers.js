const handleCustomErrors = (err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg});
    }
    next(err);
}

const handlePsqlErrors = (err, request, response, next ) => {
    if (err.code === "22P02") {
        response.status(400).send({msg: "Bad Request."});
    }
    next(err);
}

const handleInvalidPath = (request, response) => {
    response.status(404).send({msg: "Path does not exist."})
}

module.exports = {handleInvalidPath, handleCustomErrors, handlePsqlErrors};