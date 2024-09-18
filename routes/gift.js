// routes/user.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/applicants')
const Histories = require("../models/history");
const Gifts = require('../models/gift');



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


// 查找用户获得的奖品
router.get("/check/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // 检查 studentId 是否有效
    if (studentId <= 20000000) {
      return res.status(400).send("Please provide a valid student ID number!");
    }

    // 查找用户
    const applicant = await Applicant.findOne({ studentId });
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // 查找该用户的抽奖记录
    const historyRecords = await Histories.find({
      applicantStudentId: studentId,
    });

    if (historyRecords.length === 0) {
      return res.status(404).json({ message: "No gifts found for this applicant" });
    }

    // 返回用户抽到的奖品信息
    const gifts = historyRecords.map((record) => ({
      giftTitle: record.giftTitle,
      giftName: record.giftName,
      drawDate: record.date,
    }));

    res.json({
      applicant: {
        name: applicant.name,
        studentId: applicant.studentId,
        email: applicant.email,
      },
      gifts: gifts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router; // 导出 router 对象