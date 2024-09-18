const express = require("express");
const app = express();
const mongoose = require('mongoose');
const gift = require('./routes/gift');
const admin = require('./routes/admin')

//body-parser
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const port = 3000;

app.use(express.json())

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/recruitmentGift', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((dbo)=>{
    // console.log("DB Connected!");
},(err)=>{
    console.warn("!!!!!! DB connection is error, please check DB!\n>>>>>> Process will stop!");
    process.exit(1);
});

// 路由
app.use("/gift", gift);
app.use("/admin", admin);


// 根路由
app.get("/",(req,res)=>{
//    res.send("Hello,World!");
res.send("Welcome to <b>CPU Club</b> !");

} );

app.post("/",(req,res)=>{
//    res.send("Surprise!");
});

//监听3000端口
app.listen(port, () => {
    console.log(`>>>>> Services started at http://localhost:${port} !\n>>>>> Please check database status!`)
});


