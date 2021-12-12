const Employee = require("../models/employee.model.js");
const { body,validationResult } = require('express-validator/check')
const request = require('request')

exports.filter = async (req,res) => {

  await Employee.getAllFiltered(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving employees."
      });
    else res.send(data);
  });
 
}
exports.validate = (method) => {
  switch (method) {
    case 'create' : {
     return [ 
        body('employee_name').exists().withMessage("employee_name doesn't exists").matches(/^[A-Za-z\s]+$/).withMessage("employee_name must be alphabets"),
        body('employee_salary').optional().isInt({ min: 50000, max: 5000000 }).withMessage("please provide actual salary"),
        body('employee_age').optional().isInt({ min: 21, max: 70 }).withMessage("don't be too young or too old "),
        body('profile_image').optional().isString()
       ]   
    }
    case 'update' : {
      return [
        body('employee_salary').optional().isInt({ min: 50000, max: 5000000 }),
        body('employee_age').optional().isInt({ min: 21, max: 70 }),
        body('profile_image').optional().isString()
      ]
    }
  }
}


// Create and Save a new Employee
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    // Create a Employee
    const employee = new Employee({
      employee_name : req.body.employee_name,
      employee_salary : req.body.employee_salary,
      employee_age : req.body.employee_age,
      profile_image : req.body.profile_image,
    });
  
    // Save Employee in the database
    await Employee.create(employee, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Employee."
        });
      else res.send(data);
    });
  };

// Retrieve all Employees from the database .
exports.findAll = async (req, res) => {
  let limit = req.query.limit || 10
  let offset = req.query.offset || 0
  console.log(limit,offset)
    await Employee.getAll(limit,offset,(err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving employees."
        });
      else res.send(data);
    });
  };

// Find a single Employee with a id

exports.findOne = async (req, res) => {
    await Employee.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Employee with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Employee with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };


// Update a Employee identified by the id in the request
exports.update = async (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    if (req.body.employee_name){
      res.status(400).send({
        message: "Name can not be updated!"
      });
    }
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    console.log(req.body);
  
    await Employee.updateById(
      req.params.id,
      new Employee(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Employee with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Employee with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
};

// Delete a Employee with the specified id in the request
exports.delete = async (req, res) => {
    await Employee.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Employee with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Employee with id " + req.params.id
          });
        }
      } else res.send({ message: `Employee was deleted successfully!` });
    });
};

