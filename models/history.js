
const historySchema = new mongoose.Schema({
    applicantName: String,
    applicantStudentId: String,
    giftTitle: String,
    giftName: String,
    date: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);