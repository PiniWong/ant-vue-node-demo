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

exports.paylist = async(req,res)=>{
    let sql = 'select * from pay_list'
    let sort = 'order by date desc'
    let info = []
    let filter =''
    const params  = req.body
    if(params.name && !params.pay_type && !params.date){
        filter = 'where name like ?'
        info=['%'+params.name+'%']
    }
    if(params.pay_type && !params.name && !params.date){
        filter = `where pay_type = ?`
        info=[params.pay_type]
    }
    if(params.date && !params.name && !params.pay_type){
        filter = `where date = ?`
        info=[params.date]
    }
    if(params.date && params.name && !params.pay_type){
        filter = `where date = ? and where name = ?`
        info=[params.date,'%'+params.name+'%']
    }
    if(params.date && !params.name && params.pay_type){
        filter = `where date = ? and where pay_type = ?`
        info=[params.date,params.pay_type]
    }
     if(params.pay_type && params.name && params.date){
        filter = `where name like ? and pay_type = ? and date = ?`
        info=['%'+params.name+'%',params.pay_type,params.date]
    }
    sql = `${sql} ${filter} ${sort}`

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

exports.addPay = async(req,res)=>{
    let sql = 'INSERT INTO pay_list(pay_type,money,date,remark,name) values (?,?,?,?,?)'
    const params  = req.body
    let info = [params.pay_type,params.money,params.date,params.remark,params.name]
    if(params.id){
        sql = `update pay_list set pay_type=?,money=?,date=?,remark=?, name=? where id = ${params.id}`}
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
    
}
