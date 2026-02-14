import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, CheckCircle2, User, Building, BookOpen, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        batch: '',
        department: '',
        company: '',
        jobTitle: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        const userData = {
            ...formData,
            role,
            // Map specific fields based on role
            batch: role === 'student' || role === 'alumni' ? formData.batch : undefined,
            department: formData.department, // Common to both
            company: role === 'alumni' ? formData.company : undefined,
            jobTitle: role === 'alumni' ? formData.jobTitle : undefined
        };

        const result = await register(userData);

        if (result.success) {
            if (role === 'alumni') {
                navigate('/alumni/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
            <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-indigo-400/20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-2xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    class="glass-panel p-8 md:p-12 rounded-2xl"
                >
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <GraduationCap size={24} />
                            </div>
                            <span className="text-xl font-bold text-slate-900">AlumNest</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-slate-900">Join the Community</h2>
                        <p className="text-slate-500 mt-2">Create your account to connect with peers and mentors</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div
                            onClick={() => setRole('student')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${role === 'student' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <User size={24} className={role === 'student' ? 'text-blue-600' : 'text-slate-400'} />
                            <span className={`font-medium ${role === 'student' ? 'text-blue-900' : 'text-slate-600'}`}>I am a Student</span>
                            {role === 'student' && <CheckCircle2 size={16} className="text-blue-600" />}
                        </div>
                        <div
                            onClick={() => setRole('alumni')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${role === 'alumni' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <GraduationCap size={24} className={role === 'alumni' ? 'text-blue-600' : 'text-slate-400'} />
                            <span className={`font-medium ${role === 'alumni' ? 'text-blue-900' : 'text-slate-600'}`}>I am an Alumni</span>
                            {role === 'alumni' && <CheckCircle2 size={16} className="text-blue-600" />}
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
                        {error && (
                            <div className="md:col-span-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field !pl-11"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field !pl-11"
                                    placeholder="john@college.edu"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field !pl-11"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">{role === 'alumni' ? 'Graduation Batch' : 'Current Batch'}</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="input-field !pl-11"
                                    placeholder={role === 'alumni' ? 'e.g. 2024' : 'e.g. 2023-2027'}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Department</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="input-field !pl-11"
                                    placeholder="CSE"
                                />
                            </div>
                        </div>

                        {role === 'alumni' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Current Company</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="input-field !pl-11"
                                            placeholder="Google, Microsoft..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Job Title</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            className="input-field !pl-11"
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="btn-primary w-full">Create Account</button>
                        </div>
                    </form>

                    <p className="text-center mt-6 text-slate-600 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
