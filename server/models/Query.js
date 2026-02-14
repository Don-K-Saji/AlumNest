const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: { type: String, enum: ['open', 'category', 'targeted'], default: 'open' },

    // For 'category' type
    domain: { type: String }, // e.g. 'Tech', 'Finance'

    // For 'targeted' type
    targetAlumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    tags: [{ type: String }],

    responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }]

}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
