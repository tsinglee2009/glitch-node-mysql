const process_env = require('../glitch/process_env')
const mysql = require('mysql')
const fs = require('fs')

// db connect config
var connection = mysql.createConnection({
  host     : process_env.db_host,
  user     : process_env.db_user,
  password : process_env.db_password,
  database : process_env.db_name
});

// db tables config
const table_names = [ 'ev_users', 'ev_article_cates', 'ev_articles' ]

var tablesMap = new Map()
table_names.forEach(item => {
  var sql = ``
  try {
    sql = fs.readFileSync(`./sql/${item}.sql`, { encoding: 'utf8' })
  } catch(e) {
    throw e
  }
  tablesMap.set(item, sql)
});

// connect database
connection.connect((err) => {

  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('db connected as id ' + connection.threadId);

  // !!! TEST : clean tables
  // table_names.forEach(item => connection.query(`DROP TABLE IF EXISTS ` + item))

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

  if (!item) {
    
    console.log('- check table : ' + item[0])
    connection.query(item[1], (err, results) => {
        if (err) {
          console.log('error when create table : ' + table)
          return console.log(err)
        }
        
        create_table_itr(itr)
    });
  }
}

module.exports = connection