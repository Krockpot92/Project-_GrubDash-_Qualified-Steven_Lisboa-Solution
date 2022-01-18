const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
    res.json({ data: dishes });
  }

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find(dish => dish.id === dishId);

  if (foundDish) {
    res.locals.user = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  });
};

function read(req, res, next) {
  res.json({ data: res.locals.user });
};

function update(req, res,next) {
    const dish= res.locals.user
    const { data: { id, name, description, price, image_url } = {} } = req.body;
  //console.log(req.params.dishId, id)
  
  if (typeof id === 'undefined' || id === null || id=== req.params.dishId|| !id) {
    if(typeof price != 'number' || price<0 ) {
      next({ status: 400, message: `price`})
    }
    else{
      // Update the paste
      dish.name = name
      dish.description= description 
      dish.price = price
      dish.image_url= image_url

      res.json({ data: dish });
    }
  }
  else{
    //console.log("HHHHHHHHHHHHHHHHHH")
    next({ status: 400, message: `id: ${id}`})
  }  
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
  }

function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  if(price>0){
    const newDish = {
    id: +nextId, // Increment last id then assign as the current ID
    name,
    description,
    price,
    image_url
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
  }
  else{
    next({ status: 400, message: `price` })
  }
}

  module.exports = {
    list,
    read: [dishExists, read],
    update:[dishExists, bodyDataHas("name"), bodyDataHas("description"), bodyDataHas("price"),  bodyDataHas("image_url"), update],
    create: [bodyDataHas("name"), bodyDataHas("description"), bodyDataHas("price"),  bodyDataHas("image_url"), create]
  };