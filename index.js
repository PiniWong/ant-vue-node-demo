const express = require('express')
const boduParser = require('body-parser')
const webadminRouter = require('./routers/admin')
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')

const port = 3000
const app = express()


app.use('/uplodes',express.static(__dirname + '/uplodes'))

//自定义跨域中间件

var allowCors = function(req,res,next){
    res.header('Access-Control-Allow-Origin',req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With')
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Allow-Headers', 'Authorization');
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
}

app.use(allowCors);//使用跨域中间件

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(jsonParser)
app.use(urlencodedParser)
app.use(webadminRouter)

app.listen(port,()=>{
    let fs = require('fs');
    let data = fs.readFileSync('console.txt');
    console.log(data.toString());
})