var router = require("express").Router();
module.exports = app => {
    const employees = require("../controllers/employee.controller.js");
  
    app.use('/api/v1/employees',router);
    
    // Create a new Employee
    router.post(
      '/', 
      employees.validate('create'), 
      employees.create,
    )
  
    // Retrieve all Employees
    router.get('/', employees.findAll);
  
  
    // Retrieve a single Employee with id
    router.get("/:id", employees.findOne);
  
    // Retrieve filtered data with max-age and max-salary
    router.post('/filter', employees.filter)
   
    // Update a Employee with id
    router.patch(
      '/:id', 
      employees.validate('update'), 
      employees.update,
    )
  
    // Delete a Employee with id
    router.delete("/:id", employees.delete);
  
    // Delete all Employees
    // router.delete("/", employees.deleteAll);s
  
  };