const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailService');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify user (Alumni)
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin)
const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isVerified = true;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send notification to user (Admin)
// @route   POST /api/admin/notifications
// @access  Private (Admin)
const sendAdminNotification = async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ message: 'User ID and message are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create in-app notification
        await Notification.create({
            recipient: userId,
            message: `Admin Notification: ${message}`,
            type: 'admin',
            link: user.role === 'alumni' ? '/alumni/feed' : '/student/dashboard', // Default link
            read: false
        });

        // Send Email
        if (user.email) {
            await sendEmail({
                to: user.email,
                subject: 'Important Notification from AlumNest Admin',
                html: `
                    <h3>Hello ${user.name},</h3>
                    <p>You have received a new notification from the AlumNest Admin:</p>
                    <p><strong>"${message}"</strong></p>
                    <br>
                    <p>Best Regards,<br>AlumNest Team</p>
                `
            });
        }

        res.json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    verifyUser,
    deleteUser,
    sendAdminNotification
};
