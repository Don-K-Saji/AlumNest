import mongoose from 'mongoose';

const pointHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['profile', 'answer', 'vote', 'other'],
        default: 'other'
    }
}, {
    timestamps: true
});

const PointHistory = mongoose.model('PointHistory', pointHistorySchema);

export default PointHistory;
