const User = require('../models/User');
const Response = require('../models/Response');
const Query = require('../models/Query');
const Notification = require('../models/Notification');
const PointHistory = require('../models/PointHistory');

// Point Constants
const POINTS = {
    REPLY: 20,
    LIKE: 10,
    ACCEPTED: 50,
    PROFILE_COMPLETE: 50
};

// Badge Constants
const BADGES = {
    ROOKIE: { name: 'Rookie', threshold: 0 },
    RISING_STAR: { name: 'Rising Star', threshold: 100 },
    MENTOR: { name: 'Mentor', threshold: 500 },
    LEGEND: { name: 'Legend', threshold: 1000 }
};

// Helper: Award Points & Check Badges
const awardPoints = async (userId, points, action, type = 'other') => {
    const user = await User.findById(userId);
    if (!user) return;

    // Only award points to alumni
    if (user.role !== 'alumni') return;

    user.points = (user.points || 0) + points;

    // Check Badges
    const currentPoints = user.points;
    let newBadge = null;

    if (currentPoints >= BADGES.LEGEND.threshold && !user.badges.includes(BADGES.LEGEND.name)) {
        newBadge = BADGES.LEGEND.name;
    } else if (currentPoints >= BADGES.MENTOR.threshold && !user.badges.includes(BADGES.MENTOR.name)) {
        newBadge = BADGES.MENTOR.name;
    } else if (currentPoints >= BADGES.RISING_STAR.threshold && !user.badges.includes(BADGES.RISING_STAR.name)) {
        newBadge = BADGES.RISING_STAR.name;
    }

    if (newBadge) {
        user.badges.push(newBadge);
        // Create Notification for Badge
        await Notification.create({
            recipient: userId,
            message: `🎉 Congratulations! You earned the "${newBadge}" badge!`,
            type: 'badge',
            read: false
        });
    }

    await user.save();

    if (action) {
        try {
            await PointHistory.create({
                user: userId,
                action,
                points,
                type
            });
        } catch (error) {
            console.error('Error recording point history:', error);
        }
    }
};

// @desc    Toggle Like on a response
// @route   POST /api/gamification/responses/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const response = await Response.findById(req.params.id);
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }

        const userIdStr = req.user.id.toString();
        const isLiked = response.upvotes.some(id => id.toString() === userIdStr);

        if (isLiked) {
            // Unlike
            response.upvotes = response.upvotes.filter(id => id.toString() !== userIdStr);
            // Deduct points from author
            if (response.author.toString() !== userIdStr) {
                await awardPoints(response.author, -POINTS.LIKE, 'Like Removed', 'vote');
                // Note: We don't typically send a notification for unliking to avoid spam
            }
        } else {
            // Like
            response.upvotes.push(userIdStr);
            // Award points to author
            if (response.author.toString() !== userIdStr) { // Don't reward self-likes
                const authorUser = await User.findById(response.author);
                const notificationLink = authorUser && authorUser.role === 'alumni'
                    ? '/alumni/feed'
                    : `/student/queries/${response.query}`;

                await awardPoints(response.author, POINTS.LIKE, 'Received a Like', 'vote');

                // Notify author
                await Notification.create({
                    recipient: response.author,
                    message: `Someone liked your response! (+${POINTS.LIKE} pts)`,
                    type: 'like',
                    link: notificationLink,
                    read: false
                });
            }
        }

        await response.save();
        res.json(response.upvotes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Accept a response as solution
// @route   POST /api/gamification/responses/:id/accept
// @access  Private (Query Author Only)
const acceptResponse = async (req, res) => {
    try {
        const response = await Response.findById(req.params.id).populate('query');
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }

        const query = response.query;

        // Authorization: Only Query Author can accept
        if (query.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Only the query author can accept a solution.' });
        }

        // Prevent double acceptance
        if (response.isAccepted) {
            return res.status(400).json({ message: 'This response is already accepted.' });
        }

        // 1. Mark Response as Accepted
        response.isAccepted = true;
        await response.save();

        // 2. Mark Query as Resolved
        query.status = 'resolved';
        await query.save();

        // 3. Award Points to Responder
        if (response.author.toString() !== req.user.id) {
            const authorUser = await User.findById(response.author);
            const notificationLink = authorUser && authorUser.role === 'alumni'
                ? '/alumni/feed'
                : `/student/queries/${query._id}`;

            await awardPoints(response.author, POINTS.ACCEPTED, 'Get Answer Accepted', 'answer');

            // Notify Responder
            await Notification.create({
                recipient: response.author,
                message: `✅ Your answer was accepted as the solution! (+${POINTS.ACCEPTED} pts)`,
                type: 'reply',
                link: notificationLink,
                read: false
            });
        }

        res.json({ message: 'Solution accepted!', response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        // Top 10 Alumni by points
        const users = await User.find({ role: 'alumni', isVerified: true })
            .sort({ points: -1 })
            .limit(10)
            .select('name points badges jobTitle company location skills role'); // Select specific fields

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    toggleLike,
    acceptResponse,
    getLeaderboard,
    awardPoints, // Exporting helper if needed elsewhere
    POINTS
};
