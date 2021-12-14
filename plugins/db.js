const mysql = require('mysql');
const { dbMysql } = require('./DataBase.ini')
const { debug } = require('./config');

function connection(){
    return mysql.createConnection({
        host : dbMysql.host,
        user :dbMysql.user,
        password : dbMysql.password,
        port : dbMysql.port,
        database :dbMysql.database,
    })
}

function query(sql,data){
    const conn = connection()
    return new Promise((resolve,reject)=>{
        debug && console.log('sql语句：' + JSON.stringify(sql))
        try{
            conn.query(sql,data,function(error,results,fileds){
                if(error){
                    reject(error)
                    debug && console.log('数据库连接失败:' + JSON.stringify(error))
                    return
                }else{
                    resolve(results)
                    debug && console.log('数据库连接成功' + JSON.stringify(results))
                }
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    query
}