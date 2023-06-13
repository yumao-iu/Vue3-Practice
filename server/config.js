const mysql = require('mysql')
const moment = require('moment')
const dbConfig = {
   host: "sql.freedb.tech",
   database: "freedb_yumao-iu",
   username: 'freedb_yumao',
   password: '5qVm47*vPgsbB@@',

   // host: "127.0.0.1",
   // database: "vue3",
   // username: 'root',
   // password: '',
}
console.log('现在时间是:' + moment().format('YYYY-MM-DD HH:mm:ss') + ',我是/server/config.js')
const db = mysql.createConnection({
   host: dbConfig.host,
   user: dbConfig.username,
   password: dbConfig.password,
   database: dbConfig.database,
})
db.query('select 1', (err, result) => {
   if (err) console.log('数据库连接失败,请检查数据库配置')
   else console.log('数据库连接成功!')
})
module.exports = { db }