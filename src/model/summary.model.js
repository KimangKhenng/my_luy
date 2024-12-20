const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SummarySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    totalAmount: { type: Number, default: 0 },
    categoryBreakdown: {
        type: Map,
        of: Number,
        default: {}
    },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Summary', SummarySchema);
