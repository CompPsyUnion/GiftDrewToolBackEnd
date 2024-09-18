// routes/admin.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/applicants');

// 添加用户
router.post('/addUser', async (req, res) => {
    const { name, studentId, email } = req.body;
    const applicant = new Applicant({
        name,
        studentId,
        email,

    });

    try {
        await applicant.save();
        res.send('Application received!');
    } catch (error) {
        res.status(500).send('Error saving application');
    }

});

// 添加奖品
router.post('/addGift', async (req, res) => {
    const { title, name, count } = req.body;
    const applicant = new Applicant({
        title,
        name,
        count,

    });

    try {
        await applicant.save();
        res.send('Application received!');
    } catch (error) {
        res.status(500).send('Error saving application');
    }
});

// 删除学号
router.post('/delUser', (req, res) => {
    res.send('User list');
});

//查询用户
router.get('/listUser', (req, res) => {
    try {
        const Users = Applicant.find();
        console.log(Users);
        res.send(Users);
    } catch (error) {
        res.status(500).send('Error!');
        console.log('List users error.');
    }
    
});


module.exports = router; // 导出 router 对象