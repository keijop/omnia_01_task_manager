require('dotenv').config({ path: './.env' })
const mysql = require('mysql');

let connection

if(process.env.JAWSDB_URL){

  connection = mysql.createConnection(process.env.JAWSDB_URL)

} else{

  connection = mysql.createConnection({
                               host: process.env.DB_HOST, 
                               user: process.env.DB_USER, 
                               password: process.env.DB_PASSWORD, 
                               database: process.env.DB_DATABASE
                                });
}


connection.connect((err) => {
  if(err){
    throw err
  }else{
    console.log('Connected to DB...')
  }
})


 module.exports = connection


