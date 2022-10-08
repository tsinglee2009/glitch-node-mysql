const process_env = require('../glitch/process_env')
const mysql = require('mysql')

// db connect config
var connection = mysql.createConnection({
  host     : process_env.db_host,
  user     : process_env.db_user,
  password : process_env.db_password,
  database : process_env.db_name
});

// db tables config
var tablesMap = new Map()
// tablesMap.set('users', 'CREATE TABLE IF NOT EXISTS ? (id INT(11), name VARCHAR(16));')
// tablesMap.set('test_1', 'CREATE TABLE IF NOT EXISTS ? (id INT(12), name2 VARCHAR(20));')

// connect database
connection.connect((err) => {

  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('db connected as id ' + connection.threadId);

  // // clear tables
  // connection.query('drop table users')
  // connection.query('drop table test_1')

  // show all db tables
  connection.query('SHOW TABLES', (err, results) => {
    if (err) return console.log(err)
    console.log('all db tables :')
    console.log(results)

    // create tables
    create_table_itr(tablesMap.entries())
  })
});

// create table function
function create_table_itr(itr) {

  var item = itr.next().value

  if (item) {
    
    var table = item[0]
    var sql = item[1].replace('?', table)
    console.log('- check table : ' + table + ' | ' + sql)

    connection.query(sql, (err, results) => {
        if (err) {
          console.log('error when create table : ' + table)
          return console.log(err)
        }
        
        create_table_itr(itr)
    });
  }
}

module.exports = connection