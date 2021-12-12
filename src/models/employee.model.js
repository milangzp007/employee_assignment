const sql = require("./db.js");

// constructor
const Employee = function(employee) {
  this.employee_name = employee.employee_name;
  this.employee_salary = employee.employee_salary;
  this.employee_age = employee.employee_age;
  this.profile_image = employee.profile_image;
};

Employee.create = (newEmployee, result) => {
  sql.query("INSERT INTO employees SET ?", newEmployee, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created employee: ", { id: res.insertId, ...newEmployee });
    result(null, { id: res.insertId, ...newEmployee });
  });
};

Employee.findById = (id, result) => {
  sql.query(`SELECT * FROM employees WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found employee: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Employee with the id
    result({ kind: "not_found" }, null);
  });
};

Employee.findByIdAync = async (id) => {
  return sql.query(`SELECT * FROM employees WHERE id = ${id}`)
};

Employee.getAllFiltered = (input, result) => {
  let limit = input.limit || 10
  let offset = input.offset || 0;
  filter = ' 1=1 '
  if(input.age) filter += ` and employee_age ${input.age.split(':')[0]} ${input.age.split(':')[1]}`
  if(input.salary) filter += ` and employee_salary ${input.salary.split(':')[0]} ${input.salary.split(':')[1]}`
  
  let query = `SELECT * FROM employees where ${filter} LIMIT ${limit} offset ${offset}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("employees: ", res);
    result(null, res);
  });
};
Employee.getAll = (limit=10,offset=0,result) => {
  
  query = `SELECT * FROM employees LIMIT ${limit} offset ${offset}`
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("employees: ", res);
    result(null, res);
  });
};


Employee.updateById = async(id, employee, result) => {
  Employee.findById(id, (err,res)=>{
    let employee_old = res;
  sql.query(
    "UPDATE employees SET employee_salary = ?, employee_age = ?, profile_image = ? WHERE id = ?",
    [employee.employee_salary ? employee.employee_salary : employee_old.employee_salary, employee.employee_age ? employee.employee_age : employee_old.employee_age, employee.profile_image ? employee.profile_image : employee_old.profile_image, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Employee with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated employee: ", { id: id, ...employee });
      result(null, { id: id, ...employee });
    }
  );
  });
  
};

Employee.remove = (id, result) => {
  sql.query("DELETE FROM employees WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Employee with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted employee with id: ", id);
    result(null, res);
  });
};


module.exports = Employee;
