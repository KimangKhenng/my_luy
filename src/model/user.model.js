const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    telegramId: { type: String, required: true, unique: true },
    username: { type: String },
    monthlyBudget: { type: Number, default: 0 },
    categories: { type: [String], default: ['Food', 'Transport', 'Entertainment', 'Other'] }
});

module.exports = mongoose.model('User', UserSchema);
