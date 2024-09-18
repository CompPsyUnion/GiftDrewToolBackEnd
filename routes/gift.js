// routes/user.js
const express = require('express');
const router = express.Router();
const Applicant = require('../models/applicants')
const Historys = require('../models/history');
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
        if (!applicant) {
            return res.status(404).send('申请者不存在');
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
        const historyEntry = new Historys({
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

//奖品核销
// router.get('/check/:id', (req, res) => {
//     if (req.params.id <= 20000000) {
//         res.send(`Please enter your student id number!`)
//     } else {
//         console.log('Checked!');
//         res.send(`Gift for student ID: ${req.params.id} is the First prize!`)
//     }

// })



module.exports = router; // 导出 router 对象