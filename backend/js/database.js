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

  if (item) {
    // console.log('- check table : ' + item[0])

    connection.query(item[1], (err, results) => {
        if (err) {
          console.log('error when create table : ' + table)
          return console.log(err)
        }
        //
        create_table_itr(itr)
    });
  }
}

// 新加多用户功能
// 注册成功后新建两张用户表 ev_user${userid}_cates 和 ev_user${userid}_articles
connection.init_user_tables = (userid) => {

  const sql_cates = load_sql('ev_article_cates').replace(`ev_article_cates`, `ev_user${userid}_cates`)
  connection.query(sql_cates)

  const sql_arts = load_sql('ev_articles').replace(`ev_articles`, `ev_user${userid}_articles`)
  connection.query(sql_arts)

  // 插入默认文章分类数据
  var default_cate = { name: '未分类', alias: 'default' }
  const sql_insert = `insert into ${get_user_cates_table_name(userid)} set ?`
  connection.query(sql_insert, default_cate)
  
  function load_sql(table_name) {
    var sql = ``
    try {
      sql = fs.readFileSync(`./sql/${table_name}.sql`, { encoding: 'utf8' })
    } catch(e) {
      throw e
    }
    return sql
  }
}
// 获取用户文章分类表名
connection.get_user_cates_table_name = (userid) => { return `ev_user${userid}_cates` }
// 获取用户文章表名
connection.get_user_articles_table_name = (userid) => { return `ev_user${userid}_articles` }

module.exports = connection