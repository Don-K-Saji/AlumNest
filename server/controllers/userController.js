const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Ensure this is imported at the top (I might need to add it separately if not present)

// ... inside updateUserProfile ...


// @desc    Get all alumni
// @route   GET /api/users/alumni
// @access  Private

// @desc    Get all alumni
// @route   GET /api/users/alumni
// @access  Private
const getAlumni = async (req, res) => {
    try {
        const alumni = await User.find({ role: 'alumni', isVerified: true }).select('-password');
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.location = req.body.location || user.location;
            user.skills = req.body.skills || user.skills;

            // Student specific
            user.batch = req.body.batch || user.batch;
            user.department = req.body.department || user.department;

            // Alumni specific
            user.company = req.body.company || user.company;
            user.jobTitle = req.body.jobTitle || user.jobTitle;
            user.linkedin = req.body.linkedin || user.linkedin;

            // Email update with uniqueness check
            if (req.body.email && req.body.email !== user.email) {
                const userExists = await User.findOne({ email: req.body.email });
                if (userExists) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                user.email = req.body.email;
            }

            if (req.body.password) {
                if (!req.body.currentPassword) {
                    return res.status(400).json({ message: 'Please provide your current password to set a new one' });
                }

                const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid current password' });
                }

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isVerified: updatedUser.isVerified,
                batch: updatedUser.batch,
                department: updatedUser.department,
                location: updatedUser.location,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                company: updatedUser.company,
                jobTitle: updatedUser.jobTitle,
                linkedin: updatedUser.linkedin
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
    const { name, email, password, role, batch, company, jobTitle, department, location, linkedin, skills, bio } = req.body;

    // Basic Validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide name, email, password and role.' });
    }

    try {
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
            role,
            // Optional Fields
            batch,
            company,
            jobTitle,
            department,
            location,
            linkedin,
            skills,
            bio
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            // Optional fields
            user.batch = req.body.batch || user.batch;
            user.department = req.body.department || user.department;
            user.company = req.body.company || user.company;
            user.jobTitle = req.body.jobTitle || user.jobTitle;
            user.location = req.body.location || user.location;
            user.linkedin = req.body.linkedin || user.linkedin;
            user.skills = req.body.skills || user.skills;
            user.bio = req.body.bio || user.bio;
            // Check if verification status changed to true
            if (req.body.isVerified === true && user.isVerified === false) {
                const Notification = require('../models/Notification');
                await Notification.create({
                    recipient: user._id,
                    message: `Congratulations! Your profile has been verified by the admin. You can now access full alumni features.`,
                    type: 'system',
                    read: false
                });
            }

            user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAlumni,
    getUserById,
    updateUserProfile,
    createUser,
    updateUser
};
