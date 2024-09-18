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

    res.json({ message: "Applicant deleted successfully" });
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



// 修改奖品数量
router.post("/updateGiftCount", async (req, res) => {
    const { giftId, newCount } = req.body;

    try {
        // 检查 giftId 和 newCount 是否有效
        if (!giftId || newCount === undefined) {
            return res.status(400).json({ message: "Gift ID and new count are required" });
        }

        // 查找奖品并更新其数量
        const updatedGift = await Gifts.findByIdAndUpdate(
            giftId,
            { count: newCount },
            { new: true }
        );

        // 检查是否找到该奖品
        if (!updatedGift) {
            return res.status(404).json({ message: "Gift not found" });
        }

        // 返回更新后的奖品信息
        res.json({
            message: "Gift count updated successfully",
            gift: {
                id: updatedGift._id,
                title: updatedGift.title,
                name: updatedGift.name,
                count: updatedGift.count
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



module.exports = router; // 导出 router 对象