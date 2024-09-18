const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: String,
    studentId: String,
    email: String,
});

module.exports = mongoose.model('Applicant', applicantSchema);