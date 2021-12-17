const jwt = require('express-jwt')
const { PEIVATE_KEY } = require('./config')
module.exports = jwt({
    secret:PEIVATE_KEY,
    credentialsRequired:true
}).unless({
    path:[
        '/',
        '/admin/login',
        '/admin/userInfo',
        '/admin/paylist',
        '/admin/paytypeList',
        '/admin/addPay',
        '/admin/deletePay',
        '/admin/addUser',
        '/admin/addPayType',
        '/admin/beuseList',
        '/admin/addBeuse',
        '/admin/saveBeuseList'
    ]
})