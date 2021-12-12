// const sql = require("./models/db.js");
const storedData = require('../public/data.json');
const request = require("request")
  const addBulkData = async (sql)=>{

    sql.query("select count(*) from employees", (err,res)=>{
        let count = res[0]['count(*)'];
        console.log("count",res,count);
    if (count < 20){
        url = 'http://dummy.restapiexample.com/public/api/v1/employees'
    request(url, function(error, response){
      if(!error){
        const data = response.data
        data.forEach(d => {
         
        sql.query("INSERT INTO employees SET ?", d, (err, res) => {
            if(!err){
                console.log("response", res.insertId)
            }
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
      })
         
    });
        }
        else{
            storedData.forEach(emp  => {
                delete emp.id
                sql.query("INSERT INTO employees SET ?", emp, (err, res) => {
                    console.log(res.insertId)
                })
            })
            console.log(storedData)
        }
    })

    }
    else {
        console.log("data already loaded")
    }
    });
    

  }
  module.exports = addBulkData