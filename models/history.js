const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  applicantName: String,
  applicantStudentId: String,
  giftTitle: String,
  giftName: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Histories", historySchema);
