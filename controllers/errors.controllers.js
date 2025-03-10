const {response} = require("express");
const {request} = require("../app");

const handleInvalidPath = (request, response) => {
    response.status(404).send({msg: "Path does not exist."})
}

module.exports = {handleInvalidPath};