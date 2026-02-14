import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password, role);

        if (result.success) {
            // Redirect based on role returned from backend (or selected role if consistent)
            // Ideally backend returns role, but for now we trust the login flow or check user object
            if (role === 'student') navigate('/student/dashboard');
            else if (role === 'alumni') navigate('/alumni/dashboard');
            else navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 rounded-2xl"
                >
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <GraduationCap size={24} />
                            </div>
                            <span className="text-xl font-bold text-slate-900">AlumNest</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Sign in to continue to your dashboard</p>
                    </div>

                    {error && (
                        <div className="p-3 mb-6 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    {/* Role Toggle */}
                    <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
                        {['student', 'alumni', 'admin'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${role === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    className="input-field !pl-11"
                                    placeholder="you@college.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    className="input-field !pl-11"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            Sign In <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-600 text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create Account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
