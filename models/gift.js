const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema({
  title: String,
  name: String,
  count: Number,
});

module.exports = mongoose.model("Gift", giftSchema);