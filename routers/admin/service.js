const { query } = require('../../plugins/db.js')
const { md5 } = require('../../plugins/md5.js')
var jwt = require('jsonwebtoken');

const { PED_SALT, EXPIRE_SIN, PEIVATE_KEY } = require('../../plugins/config.js');
const { assert, info } = require('console');
const { param } = require('./index.js');
let data
const s = {
    "success": true,
    "msg": "操作成功"
}
const e = {
    "success":false,
    "msg": "操作失败"
}
const en = {
    "success": false,
    "msg": "没有权限"
}
const ep = {
    "success": false,
    "msg": "用户名重复"
}

exports.login = async(req,res)=>{
    req.body.password = md5(`${req.body.password}${PED_SALT}`)
    let info = [req.body.username, req.body.password]
    let sql = 'select * from admin where username=? and password=?'
    console.log(req.body)
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }   //    数据库里面没找到配对的内容返回参数
    }else{
        console.log(result[0].user_id)
        let uid = result[0].user_id
        let nickname = result[0].nickname
        let username = result[0].username
        let jurisdiction = {
            isyh: result[0].isyh,
            isgl: result[0].isgl,
            issh: result[0].issh,
            isfk: result[0].isfk,
            user_state: result[0].user_state,
        }
        let token = jwt.sign(
            { uid, username, jurisdiction },
            PEIVATE_KEY,
            { expiresIn: EXPIRE_SIN }
        )
        data = {
            state: s,
            data: {
                token: token,
                userinfo: {
                    uid: uid,
                    nickname: nickname,
                    username: username,
                    jurisdiction: jurisdiction
                }
            }
        }
    }
    console.log(data)
    
    res.send(data);
}

exports.userInfo = async(req,res)=>{
    let sql = 'select * from userinfo'
    let info = []
    const results = await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
            list:results
        }
    }
    res.send(data)
}
//支付方式
exports.paytypeList = async(req,res)=>{
    let sql = 'select * from pay_type_list'
    let info = []
    const results = await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
            list:results
        }
    }
    res.send(data)
}
exports.addPayType=async(req,res)=>{
    let sql ='INSERT INTO pay_type_list(info) values(?)'
    let info = [req.body.pay]
    const results = await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
        }
    }
    res.send(data)
}

exports.paylist = async(req,res)=>{
    let sql = `SELECT * FROM (pay_list INNER JOIN userinfo ON pay_list.userId=userinfo.userId) INNER JOIN beuse ON pay_list.beuse=beuse.beuse`
    let sort = 'order by date desc'
    let info = []
    let changeSql=''
    let filter =''
    const params  = req.body

    let arrParams = [params.userId,params.pay_type,params.date||params.month,params.beuse]
    let userSql = `pay_list.userId = ${params.userId}`
    let payTypeSql = `pay_type = ${params.pay_type}`
    let beuseSql = `pay_list.beuse = ${params.beuse}`
    let dateSql = ''
    if(params.date){
        
            dateSql = `date = '${params.date}'`
    }else{
            dateSql = `month(date) = month('${params.month}')`
    }
    let arrSql =[userSql,payTypeSql,dateSql,beuseSql]

    let flag = true
    for (const i in arrParams) {
        // console.log(i)
        if(arrParams[i]&&flag){
            // console.log('666')
            sql=`${sql} where ${arrSql[i]}` 
            flag=false
        }
        if(arrParams[i]&&!flag){
            changeSql=`and ${arrSql[i]}` 
        }
    }
    sql = `${sql} ${changeSql} ${sort}`

    const results =await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
            list:results
        }
    }
    res.send(data)
}
//支付列表
exports.addPay = async(req,res)=>{
    let sql = 'INSERT INTO pay_list(pay_type,money,date,remark,userId,beuse) values (?,?,?,?,?,?)'
    const params  = req.body
    let info = [params.pay_type,params.money,params.date,params.remark,params.userId,params.beuse]
    if(params.id){
        sql = `update pay_list set pay_type=?,money=?,date=?,remark=?, userId=? ,beuse=? where id = ${params.id}`
    }

    const results = await query(sql,info) 
    console.log(results)
    if(results[0]==''){
        data={
            state:e
        }
    }else{
        data={
            state:s,
        }
    }
    res.send(data)
}
exports.deletePay=async(req,res)=>{
    let sql = 'delete from pay_list where id = ?'
    const params  = req.body
    let info = [params.id]
    const results = await query(sql,info) 
    if(results[0]==''){
        data={
            state:e
        }
    }else{
        data={
            state:s,
        }
    }
    res.send(data)
}
exports.monthPayList=async(req,res)=>{
    let sql =''
    let info = [req.body.id]
}

exports.addUser=async(req,res)=>{
    let sql ='INSERT INTO userinfo(name) values(?)'
    let info = [req.body.name]
    const results = await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
        }
    }
    res.send(data)
}

//支出类型
exports.beuseList = async(req,res)=>{
    let sql = 'select * from beuse order by createTime desc'
    let info = []
    const results = await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
            list:results
        }
    }
    res.send(data)
}
exports.addBeuse=async(req,res)=>{
    let sql ='INSERT INTO beuse(beType,color,state) values(?,?,0)'
    let info = [req.body.beType,req.body.color]
    const beuse = req.body.beuse
    if(beuse){
        sql = `updata beuse set beType = ? and color = ? where beuse = ${beuse}`
    }
    const results = await query(sql,info)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s,
        }
    }
    res.send(data)
}
exports.saveBeuseList=async(req,res)=>{
    let sqls = ''
    let info = req.body.list
    info.forEach(el => {
        if(el.state==3){
            sqls = `${sqls} delete from beuse  where beuse = ${el.beuse} ;`
        }else{
            sqls = `${sqls} UPDATE beuse set state = ${el.state} where beuse = ${el.beuse} ;`
        }

    });
    const results = await query(sqls)
    if(!results){
        data={
            state:e
        }
    }else{
        data={
            state:s
        }
    }
    res.send(data)
}
