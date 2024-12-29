const mongoose = require('mongoose');

/**
 * WIP
 */
const SummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
    },
    totalAmount: { type: Number, default: 0 },
    categoryBreakdown: {
      type: Map,
      of: Number,
      default: {},
    },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Summary', SummarySchema);
