// routes/user.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/applicants')
const Histories = require("../models/history");
const Gifts = require('../models/gift');



// 根据权重随机抽取礼品
function weightedRandomChoice(gifts) {
    const totalWeight = gifts.reduce((sum, gift) => sum + gift.count, 0);
    let randomNum = Math.random() * totalWeight;

    for (const gift of gifts) {
        if (randomNum < gift.count) {
            return gift;
        }
        randomNum -= gift.count;
    }
}

// 使用学号(抽奖码)抽奖
router.get('/drew/:id', async (req, res) => {
    const studentId = req.params.id;
    console.log(studentId);
    try {
        // 根据 studentId 检查申请者是否存在
        const applicant = await Applicant.findOne( {studentId} );
        console.log(applicant)
        if (!applicant || applicant.invalid) {
          return res.status(404).send('申请者不存在或抽奖码已经使用');
        }
        console.log("b");
        // 获取所有库存大于 0 的礼品
        const gift = await Gifts.find({ count: { $gt: 0 } });
        console.log("c");
        if (gift.length === 0) {
            return res.status(400).send('没有可用的奖品');
        }
        console.log("d");
        // 按照权重随机选择一个奖品
        const selectedGift = weightedRandomChoice(gift);

        // 更新礼品库存
        selectedGift.count -= 1;
        await selectedGift.save();

        // 将抽奖信息记录到 History 表中
        const historyEntry = new Histories({
            applicantName: applicant.name,
            applicantStudentId: applicant.studentId,
            giftTitle: selectedGift.title,
            giftName: selectedGift.name
        });
        await historyEntry.save();
        console.log('Gift has been released!');
        // 返回抽奖结果
        res.status(200).send({
            message: '抽奖成功',
            applicant: applicant.name,
            studentId: applicant.studentId,
            gift: selectedGift.title,
            name: selectedGift.name
        });
    } catch (error) {
        res.status(500).send('服务器错误');
    }


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