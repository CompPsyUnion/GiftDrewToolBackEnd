const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: String,
    studentId: String,
    email: String,
    hasWon: { type: Boolean, default: false }
});

module.exports = mongoose.model('Applicant', applicantSchema);