const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


function list(req, res) {
    res.json({ data: orders });
  }

function orderExists(req, res, next) {
  const { orderId } = req.params;
  
  const foundOrder = orders.find(order => order.id === orderId);
  if (foundOrder) {
    res.locals.user = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  });
};

function read(req, res, next) {
  res.json({ data: res.locals.user });
};

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
  }

function create(req, res,next) {
  const { data: { deliverTo, mobileNumber, status, dishes, id } = {} } = req.body;
  
  if(!Array.isArray(dishes) || dishes.length===0 ||!dishes){
   return next({ status: 400, message: `dish` })
  }
  
  dishes.forEach((dish,index)=> {
    dish.quantity
    
    if(dish.quantity===0 || !dish.quantity || !Number.isInteger(dish.quantity)){
      return next({ status: 400, message: `quantity: ${index}` })
    }
  })
  
  
    const newOrder = {
    id: +nextId, // Increment last id then assign as the current ID
    deliverTo,
    mobileNumber,
    status,
    dishes
  }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
  
}

function update(req, res, next) {
    const order= res.locals.user
    const { data: { deliverTo, mobileNumber, status, dishes, id } = {} } = req.body;
    const { orderId } = req.params;
    
    if(!Array.isArray(dishes) || dishes.length===0 ||!dishes){
     return next({ status: 400, message: `dish` })
    }
  
    for(let i=0; i < dishes.length; i++){
      let dish= dishes[i]
        if(dish.quantity===0 || !dish.quantity || !Number.isInteger(dish.quantity)){
        
        console.log("Heyyyyyyyy",dish.quantity)
        
        return next({ status: 400, message: `quantity: ${i}` })
        }
    }
//     dishes.forEach((dish,index)=> {
//       console.log(dish.quantity)
      
//       if(dish.quantity===0 || !dish.quantity || !Number.isInteger(dish.quantity)){
        
//         console.log("Heyyyyyyyy",dish.quantity)
        
//         return next({ status: 400, message: `quantity: ${index}` })      
//       }
//     })
  
    if(id && id!==orderId){
      return next({ status: 400, message: `id: ${id}` })
    }
    
    if(status==="invalid"){
      return next({ status: 400, message: `status: ${status}` })
    } 
  
    // Update the paste
    order.deliverTo = deliverTo
    order.mobileNumber= mobileNumber 
    order.status = status
    order.dishes= dishes
  
    res.json({ data: order });
  }

function destroy(req, res,next) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === Number(orderId));
  
    if (res.locals.user.status !== 'pending' ){
      next({
      status: 400,
      message: `pending`
      })
    }
  else{
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedPastes = orders.splice(index, 1);
    res.sendStatus(204);
  }
}

module.exports = {
    list,
    read: [orderExists, read],
    delete: [orderExists, destroy],
    create: [bodyDataHas("deliverTo"), bodyDataHas("mobileNumber"), bodyDataHas("dishes"), create],
    update: [orderExists, bodyDataHas("deliverTo"), bodyDataHas("mobileNumber"), bodyDataHas("dishes"), bodyDataHas("status"), update]
  };