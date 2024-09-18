// routes/admin.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/applicants');
const Gifts = require('../models/gift');


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

// 删除用户
router.post("/deleteUser", async (req, res) => {
  const { studentId } = req.body;  // 从请求体中获取 studentId

  try {
    // 查找并删除用户
    const deletedApplicant = await Applicant.findOneAndDelete({ studentId });

    if (!deletedApplicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // 删除该用户的抽奖历史记录
    await Histories.deleteMany({ applicantId: deletedApplicant._id });

    res.json({ message: "Applicant and related history deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 添加奖品
router.post('/addGift', async (req, res) => {
    const { title, name, count } = req.body;
    const gift = new Gifts({
        title,
        name,
        count,

    });

    try {
        await gift.save();
        res.send('Message received!');
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