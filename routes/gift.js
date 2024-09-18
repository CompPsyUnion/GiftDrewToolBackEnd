// routes/user.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/applicants')


// 使用学号(抽奖码)抽奖
router.get('/drew/:id', (req, res) => {
    //检查数据库是否有此学号存在
    
    //抽奖逻辑
    res.send(`Drew a gift with ID ${req.params.id}`);
    console.log('Gift has been released!')
});


// 奖品核验
router.get('/check/:id', (req, res) => {
    if (req.params.id <= 20000000) {
        res.status(500).send(`Please your student id number!`)
    } else {
        console.log('Checked!');
        res.send(`Gift for student ID: ${req.params.id} is the First prize!`)
    }
    
})

//奖品核销
router.get('/check/:id', (req, res) => {
    if (req.params.id <= 20000000) {
        res.send(`Please enter your student id number!`)
    } else {
        console.log('Checked!');
        res.send(`Gift for student ID: ${req.params.id} is the First prize!`)
    }

})



module.exports = router; // 导出 router 对象