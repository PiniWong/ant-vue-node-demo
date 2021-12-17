const express = require('express')
const router = express.Router()
const service = require('./service')


router.post('/admin/login',service.login)

router.post('/admin/addPayType',service.addPayType)
router.post('/admin/paytypeList',service.paytypeList)

router.post('/admin/paylist',service.paylist)

router.post('/admin/addPay',service.addPay)
router.post('/admin/deletePay',service.deletePay)

router.post('/admin/userInfo',service.userInfo)
router.post('/admin/addUser',service.addUser)

router.post('/admin/beuseList',service.beuseList)
router.post('/admin/addBeuse',service.addBeuse)
router.post('/admin/saveBeuseList',service.saveBeuseList)

module.exports = router;