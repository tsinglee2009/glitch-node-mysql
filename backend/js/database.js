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
const TABLE_USERS = 'ev_users'
const TABLE_CATES = 'ev_article_cates'
const TABLE_ARTICLES = 'ev_articles'
// db default cate name & alias
const CATE_DEFAULT = {
  name: "未命名",
  alias: 'default'
}
  
// 加载sql文件内容
function load_sql_content(table_name, callback) {
  var sql = ``
  try {
    sql = fs.readFileSync(`./sql/${table_name}.sql`, { encoding: 'utf8' })
  } catch(e) {
    return callback(e)
  }
  return callback(sql)
}

// 初始化表的公共方法
// data 必须包含下面三个参数
//  - sql_name : 建表的sql文件名
//  - table_name : 将要创建的表名
// callback(err, status) : status为1表示第一次建表
function check_to_create_table(data, callback) {

  // 异常处理
  try
  {
    var t_table = data.table_name.length
    var t_sql = data.sql_name.length
    var t_cb = callback.__proto__
  } catch(e) {
    throw new Error(e)
  }

  const table_name = `${data.table_name}`
  const sql_name = `${data.sql_name}`

  // 检索表
  connection.query(`SHOW TABLES LIKE '${table_name}'`, (err, res) => {
    if (err) return callback(err)
    // 表已存在，非第一次建表
    if (res !== 1) return callback(null, 0)
    // 表不存在，第一次创建表
    load_sql_content(sql_name, (sql) => {
      if (sql instanceof Error) return callback(sql)
      // 表名替换
      if (sql_name !== table_name)
        sql = sql.replace(sql_name, table_name)
      // 执行建表
      connection.query(sql, (err, res) => {
        if (err) return callback(err)
        // 重置表的id (应该可以建表时同步设置)
        connection.query(`TRUNCATE TABLE ${table_name}`, (err, res) => {
          if (err) return callback(err)
          // 第一次建表完成
          return callback(null, 1)
        })
      })
    })
  })
}

// connect database
connection.connect((err) => {

  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('db connected as id ' + connection.threadId);

  // show all db tables
  connection.query('SHOW TABLES', (err, results) => {
    if (err) return console.log(err)
    console.log('all db tables :')
    console.log(results)

    check_to_create_table({ table_name: '', sql_name: '' }, () => {})

    // 初始化 用户表
    check_to_create_table({ table_name: TABLE_USERS, sql_name: TABLE_USERS }, (err, status) => {
      if (err) console.log(err)
      else if (status === 1) {
        // 第一次建表
      }
    })
  })
});

// 新加多用户功能
// 注册成功后新建两张用户表 ev_user${userid}_cates 和 ev_user${userid}_articles
connection.init_user_tables = (userid) => {

  const TABLE_USER_CATES = connection.get_user_cates_table_name(userid)
  const TABLE_USER_ARTICLES = connection.get_user_articles_table_name(userid)

  // 初始化 文章分类表
  check_to_create_table({ table_name: TABLE_USER_CATES, sql_name: TABLE_CATES }, (err, status) => {
    if (err) console.log(err)
    else if (status === 1) {
      // 第一次建表，添加默认分类
      connection.query(`insert into ${TABLE_USER_CATES} (name, alias) values ("${CATE_DEFAULT.name}", "${CATE_DEFAULT.alias}")`)
    }
  })

  // 初始化 文章表
  check_to_create_table({ table_name: TABLE_USER_ARTICLES, sql_name: TABLE_ARTICLES }, (err, status) => {
    if (err) console.log(err)
    else if (status === 1) {
      // 第一次建表
    }
  })
}

// 获取用户文章分类表名
connection.get_user_cates_table_name = (userid) => { return `ev_user${userid}_cates` }
// 获取用户文章表名
connection.get_user_articles_table_name = (userid) => { return `ev_user${userid}_articles` }
// 文章的默认分类名
connection.default_cate_names = CATE_DEFAULT

module.exports = connection