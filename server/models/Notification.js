const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['query', 'reply', 'badge', 'system', 'like'], default: 'system' },
    link: { type: String }, // Optional URL to redirect
    read: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
