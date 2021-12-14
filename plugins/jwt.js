const jwt = require('express-jwt')
const { PEIVATE_KEY } = require('./config')
module.exports = jwt({
    secret:PEIVATE_KEY,
    credentialsRequired:true
}).unless({
    path:[
        '/',
        '/admin/login',
        '/admin/paylist',
        '/admin/addPay',
        '/admin/deletePay'
    ]
})