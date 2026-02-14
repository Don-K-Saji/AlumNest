import React, { useState } from 'react';
import { X, User, Mail, Lock, Briefcase, GraduationCap, Building, MapPin, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [role, setRole] = useState('student'); // student, alumni, admin
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        batch: '',
        department: '',
        company: '',
        jobTitle: '',
        location: '',
        linkedin: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                role,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
            };
            await api.post('/users', payload);
            onUserAdded();
            onClose();
            // Reset form
            setFormData({
                name: '', email: '', password: '', batch: '', department: '', company: '', jobTitle: '', location: '', linkedin: '', skills: ''
            });
            setRole('student');
        } catch (err) {
            console.error("Failed to add user", err);
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Role Selector */}
                        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                            {['student', 'alumni', 'admin'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold capitalize transition-all ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField icon={User} label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="John Doe" />
                                <InputField icon={Mail} label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="john@example.com" />
                            </div>

                            <InputField icon={Lock} label="Password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} placeholder="••••••••" />

                            {/* Role Specific Fields using AnimatePresence for smooth toggle could be nice, keeping it simple for now */}
                            {role === 'student' && (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                                    <InputField icon={GraduationCap} label="Batch" value={formData.batch} onChange={(v) => setFormData({ ...formData, batch: v })} placeholder="2024" />
                                    <InputField icon={Building} label="Department" value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} placeholder="CSE" />
                                </div>
                            )}

                            {role === 'alumni' && (
                                <div className="space-y-4 pt-2 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField icon={GraduationCap} label="Batch" value={formData.batch} onChange={(v) => setFormData({ ...formData, batch: v })} placeholder="2024" />
                                        <InputField icon={Building} label="Department" value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} placeholder="CSE" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField icon={Building} label="Company" value={formData.company} onChange={(v) => setFormData({ ...formData, company: v })} placeholder="Google" />
                                        <InputField icon={Briefcase} label="Job Title" value={formData.jobTitle} onChange={(v) => setFormData({ ...formData, jobTitle: v })} placeholder="SDE II" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField icon={MapPin} label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} placeholder="New York, USA" />
                                        <InputField icon={Linkedin} label="LinkedIn URL" value={formData.linkedin} onChange={(v) => setFormData({ ...formData, linkedin: v })} placeholder="https://linkedin.com/in/..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Skills (Comma separated)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                                            placeholder="React, Node.js, Python"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const InputField = ({ icon: Icon, label, type = "text", value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-3 text-slate-400">
                <Icon size={18} />
            </div>
            <input
                type={type}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

export default AddUserModal;
