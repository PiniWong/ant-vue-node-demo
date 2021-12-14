const express = require('express')
const router = express.Router()
const service = require('./service')


router.post('/admin/login',service.login)
router.post('/admin/paylist',service.paylist)
router.post('/admin/addPay',service.addPay)
router.post('/admin/deletePay',service.deletePay)



module.exports = router;