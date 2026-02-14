import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Briefcase, GraduationCap, MapPin, Link as LinkIcon, AlertCircle, Mail, Lock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        currentPassword: '',
        bio: '',
        location: '',
        skills: '', // Comma separated string for input
        // Student
        batch: '',
        department: '',
        // Alumni
        company: '',
        jobTitle: '',
        linkedin: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize form with user data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Always reset password field
                confirmPassword: '',
                currentPassword: '',
                bio: user.bio || '',
                location: user.location || '',
                skills: user.skills ? user.skills.join(', ') : '',
                batch: user.batch || '',
                department: user.department || '',
                company: user.company || '',
                jobTitle: user.jobTitle || '',
                linkedin: user.linkedin || ''
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Password Validation
        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                setError("New passwords do not match");
                setLoading(false);
                return;
            }
            if (!formData.currentPassword) {
                setError("Please enter your current password to confirm changes");
                setLoading(false);
                return;
            }
        }

        try {
            // Convert skills string back to array
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);

            const payload = {
                ...formData,
                skills: skillsArray
            };

            const { data } = await api.put('/users/profile', payload);
            console.log("Profile update success, server response:", data);

            // Update auth context with new user data
            // Maintain the token from existing user object or the response if backend returns it
            // Safely retrieve token from current user state or localStorage as fallback
            const currentToken = user?.token || JSON.parse(localStorage.getItem('user'))?.token;

            const updatedUser = { ...data, token: currentToken };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage

            onClose(); // Close modal on success
        } catch (err) {
            console.error("Profile Update Error:", err);
            // Construct a more descriptive error message
            let errorMessage = 'Failed to update profile';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isStudent = user?.role === 'student';
    const isAlumni = user?.role === 'alumni';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto"
                    />

                    {/* Modal Container to handle scrolling */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                                        <AlertCircle size={18} />
                                        {error}
                                    </div>
                                )}

                                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basics */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Settings */}
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Account Settings</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-200">
                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Change Password</h4>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-sm font-medium text-slate-700">Current Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                                            <input
                                                                type="password"
                                                                name="currentPassword"
                                                                value={formData.currentPassword}
                                                                onChange={handleChange}
                                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                                placeholder="Required to set new password"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700">New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                                placeholder="Enter new password"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={formData.confirmPassword}
                                                                onChange={handleChange}
                                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                                placeholder="Confirm new password"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 resize-none"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>

                                    {/* Student Specific */}
                                    {isStudent && (
                                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-6">
                                            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                                                <GraduationCap size={16} /> Student Details
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Department</label>
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                        placeholder="e.g. Computer Science"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Batch Year</label>
                                                    <input
                                                        type="text"
                                                        name="batch"
                                                        value={formData.batch}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                                        placeholder="e.g. 2025"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Alumni Specific */}
                                    {isAlumni && (
                                        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-6">
                                            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                                                <Briefcase size={16} /> Professional Info
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Company</label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-700"
                                                        placeholder="Current Company"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Job Title</label>
                                                    <input
                                                        type="text"
                                                        name="jobTitle"
                                                        value={formData.jobTitle}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-700"
                                                        placeholder="e.g. SDE II"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                                                        <input
                                                            type="text"
                                                            name="linkedin"
                                                            value={formData.linkedin}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-700"
                                                            placeholder="https://linkedin.com/in/..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                            placeholder="React, Node.js, Design..."
                                        />
                                    </div>

                                </form>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl sticky bottom-0 z-10 flex justifying-end">
                                <div className="flex gap-3 ml-auto">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        form="edit-profile-form"
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
