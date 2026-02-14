const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
    query: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },

    isHelpful: { type: Boolean, default: false }, // Simple helpful toggle
    isAccepted: { type: Boolean, default: false }, // Solves the query (High Reward)
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked

}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);
