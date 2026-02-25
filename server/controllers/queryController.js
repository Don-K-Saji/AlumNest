const Query = require('../models/Query');
const Response = require('../models/Response');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { awardPoints, POINTS } = require('./gamificationController');

const sendEmail = require('../utils/emailService');

// @desc    Create a new query
// @route   POST /api/queries
// @access  Private (Student)
const createQuery = async (req, res) => {
    const { title, description, type, domain, targetAlumni, tags } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
        const query = await Query.create({
            title,
            description,
            author: req.user.id,
            type,
            domain,
            targetAlumni,
            tags
        });

        // NOTIFICATION LOGIC
        if (type === 'category' && domain) {
            // Find matching alumni
            // Case-insensitive regex for the domain/skill
            const regex = new RegExp(domain, 'i');

            const matchingAlumni = await User.find({
                role: 'alumni',
                $or: [
                    { company: { $regex: regex } },
                    { skills: { $in: [regex] } },
                    { jobTitle: { $regex: regex } }, // e.g. "Product Manager"
                    { location: { $regex: regex } }  // e.g. "California"
                ]
            });

            // Note: $in with regex works in modern MongoDB for array of strings.

            if (matchingAlumni.length > 0) {
                const notifications = matchingAlumni.map(alum => ({
                    recipient: alum._id,
                    message: `New query targeting your expertise in ${domain}: "${title}"`,
                    type: 'query',
                    link: `/alumni/feed`, // Or specific query link if available
                    read: false
                }));

                await Notification.insertMany(notifications);
            }
        } else if (type === 'targeted' && targetAlumni) {
            await Notification.create({
                recipient: targetAlumni,
                message: `You have a direct private query: "${title}"`,
                type: 'query',
                link: `/alumni/feed`,
                read: false
            });

            // EMAIL NOTIFICATION
            const alumni = await User.findById(targetAlumni);
            if (alumni && alumni.email) {
                await sendEmail({
                    to: alumni.email,
                    subject: 'New Private Query on AlumNest',
                    html: `
                        <h3>Hello ${alumni.name},</h3>
                        <p>You have a new private query from a student.</p>
                        <p><strong>Query:</strong> ${title}</p>
                        <p>Please log in to AlumNest to respond.</p>
                        <br>
                        <p>Best Regards,<br>AlumNest Team</p>
                    `
                });
            }
        }

        res.status(201).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all queries
// @route   GET /api/queries
// @access  Private
const getQueries = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let queryFilters = { status: 'active' };

        // Core Visibility Logic:
        // 1. Open queries (visible to everyone)
        // 2. Private/Targeted queries WHERE (author is user OR targetAlumni is user)

        queryFilters.$or = [
            { type: 'open' },
            { type: 'category' }, // Assuming these are public too
            { author: userId },
            { targetAlumni: userId }
        ];

        // Apply additional filters from request
        if (req.query.type) queryFilters.type = req.query.type;
        if (req.query.domain) queryFilters.domain = req.query.domain;

        // Populate author, targetAlumni, and responses
        const queries = await Query.find(queryFilters)
            .populate('author', 'name batch role')
            .populate('targetAlumni', 'name jobTitle company')
            .populate({
                path: 'responses',
                populate: { path: 'author', select: 'name role' }
            })
            .sort({ createdAt: -1 });

        res.json(queries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single query
// @route   GET /api/queries/:id
// @access  Private
const getQueryById = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id)
            .populate('author', 'name role')
            .populate('targetAlumni', 'name role jobTitle company')
            .populate({
                path: 'responses',
                populate: { path: 'author', select: 'name role badges company jobTitle location skills' }
            });

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Access Control:
        // If query is 'targeted' (private), ONLY author or target can view it.
        // Admin can view everything.
        const isPrivate = query.type === 'targeted' || query.type === 'direct'; // Handling both just in case
        if (isPrivate) {
            const isAuthorized =
                query.author._id.toString() === req.user.id ||
                (query.targetAlumni && query.targetAlumni._id.toString() === req.user.id) ||
                req.user.role === 'admin';

            if (!isAuthorized) {
                return res.status(403).json({ message: 'Access denied to private query' });
            }
        }

        res.json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add response to query
// @route   POST /api/queries/:id/responses
// @access  Private (Alumni/Admin)
const addResponse = async (req, res) => {
    const { content } = req.body;
    const queryId = req.params.id;

    if (!content) {
        return res.status(400).json({ message: 'Response content is required' });
    }

    try {
        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        const response = await Response.create({
            query: queryId,
            author: req.user.id,
            content
        });

        // Add response to query array
        query.responses.push(response._id);
        await query.save();

        // NOTIFICATION LOGIC
        // Notify the query author that someone replied (if it's not the author themselves replying)

        // ...

        // NOTIFICATION LOGIC
        // Notify the query author that someone replied (if it's not the author themselves replying)
        if (query.author.toString() !== req.user.id) {
            await Notification.create({
                recipient: query.author,
                message: `${req.user.name} replied to your query: "${query.title}"`,
                type: 'reply',
                link: `/student/queries/${query._id}`,
                read: false
            });

            // EMAIL NOTIFICATION
            try {
                const author = await User.findById(query.author);
                if (author && author.email) {
                    await sendEmail({
                        to: author.email,
                        subject: 'New Reply to Your Query on AlumNest',
                        html: `
                            <h3>Hello ${author.name},</h3>
                            <p>${req.user.name} has replied to your query: "${query.title}"</p>
                            <p><strong>Reply:</strong> ${content}</p>
                            <p>Head over to AlumNest to view and continue the discussion.</p>
                            <br>
                            <p>Best Regards,<br>AlumNest Team</p>
                        `
                    });
                }
            } catch (emailErr) {
                console.error("Failed to send email notification:", emailErr);
            }

            // AWARD POINTS for Reply
            // Only award if it's an Alumni replying
            if (req.user.role === 'alumni') {
                await awardPoints(req.user.id, POINTS.REPLY, 'Answered a Query', 'answer');
            }
        }

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update query status
// @route   PUT /api/queries/:id/status
// @access  Private (Author/Admin)
const updateQueryStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const query = await Query.findById(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Check ownership (only author or admin can update status) -- assuming simplified check for now
        if (query.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        query.status = status;
        await query.save();

        res.json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Edit a response
// @route   PUT /api/queries/responses/:responseId
// @access  Private (Author)
const editResponse = async (req, res) => {
    const { content } = req.body;
    const { responseId } = req.params;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        const response = await Response.findById(responseId);

        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }

        // Check ownership
        if (response.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to edit this response' });
        }

        response.content = content;
        await response.save();

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateQuery = async (req, res) => {
    const { title, description, tags } = req.body;

    try {
        const query = await Query.findById(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Check ownership
        if (query.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        query.title = title || query.title;
        query.description = description || query.description;
        if (tags) query.tags = tags;

        await query.save();

        // Refetch with full population to ensure frontend doesn't lose data
        const populatedQuery = await Query.findById(req.params.id)
            .populate('author', 'name role')
            .populate('targetAlumni', 'name role jobTitle company')
            .populate({
                path: 'responses',
                populate: { path: 'author', select: 'name role badges company jobTitle location skills' }
            });

        res.json(populatedQuery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Nudge alumni for a query
// @route   POST /api/queries/:id/nudge
// @access  Private (Admin/Author)
const nudgeQuery = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Authorization: Only Admin or Author can nudge
        if (query.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        let notifications = [];

        if (query.type === 'targeted' && query.targetAlumni) {
            notifications.push({
                recipient: query.targetAlumni,
                message: `Reminder: You have a direct query waiting for your response: "${query.title}"`,
                type: 'query',
                link: `/alumni/feed`,
                read: false
            });
        } else if (query.type === 'category' && query.domain) {
            const regex = new RegExp(query.domain, 'i');
            const matchingAlumni = await User.find({
                role: 'alumni',
                $or: [
                    { company: { $regex: regex } },
                    { skills: { $in: [regex] } },
                    { jobTitle: { $regex: regex } }
                ]
            });

            notifications = matchingAlumni.map(alum => ({
                recipient: alum._id,
                message: `Reminder: A query in ${query.domain} needs your expertise: "${query.title}"`,
                type: 'query',
                link: `/alumni/feed`,
                read: false
            }));

        } else if (query.type === 'open') {
            // Broadcast to ALL Alumni
            const allAlumni = await User.find({ role: 'alumni' });

            if (allAlumni.length > 0) {
                notifications = allAlumni.map(alum => ({
                    recipient: alum._id,
                    message: `New Open Query: "${query.title}" - Can you help?`,
                    type: 'query',
                    link: `/alumni/feed`,
                    read: false
                }));
            }
        }

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            return res.json({ message: `Successfully nudged ${notifications.length} alumni.` });
        } else {
            return res.json({ message: 'No relevant alumni found to nudge.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createQuery,
    getQueries,
    getQueryById,
    addResponse,
    updateQueryStatus,
    editResponse,
    updateQuery,
    nudgeQuery
};
