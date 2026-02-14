const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false }, // For alumni

    // Profile Details
    batch: { type: String }, // e.g. 2024
    department: { type: String },
    location: { type: String },
    bio: { type: String },
    skills: [{ type: String }],

    // Alumni Specific
    company: { type: String },
    jobTitle: { type: String },
    linkedin: { type: String },

    // Gamification
    points: { type: Number, default: 0 },
    badges: [{ type: String }], // 'Rookie', 'Rising Star', 'Mentor', 'Legend'

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
