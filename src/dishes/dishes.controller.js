const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
    res.json({ data: dishes });
  }



  module.exports = {
    list,
  };