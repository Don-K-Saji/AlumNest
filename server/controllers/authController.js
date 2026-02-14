const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, batch, department, company, jobTitle } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        // Optional Fields
        batch,
        department,
        company,
        jobTitle
    });

    if (user) {
        // Notify Admins if new user is an Alumni (needing verification)
        if (role === 'alumni') {
            const Notification = require('../models/Notification');
            const admins = await User.find({ role: 'admin' });

            if (admins.length > 0) {
                const notifications = admins.map(admin => ({
                    recipient: admin._id,
                    message: `New Alumni registered: ${name}. Verification required.`,
                    type: 'system',
                    link: '/admin/verify-users',
                    read: false
                }));
                await Notification.insertMany(notifications);
            }
        }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        // Enforce Role Check
        if (role && user.role !== role) {
            return res.status(401).json({
                message: `Access denied. You are registered as a ${user.role}, not a ${role}.`
            });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({
            message: 'Invalid credentials',
            debug: {
                userFound: !!user,
                roleProvided: role,
                userRole: user ? user.role : null,
                emailProvided: email
            }
        });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Update User Roadplan
// @route   PUT /api/auth/roadplan
// @access  Private
const updateRoadplan = async (req, res) => {
    const { roadplan } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.roadplan = roadplan;
        const updatedUser = await user.save();

        res.json(updatedUser.roadplan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateRoadplan
};
