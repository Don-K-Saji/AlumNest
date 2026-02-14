import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../services/api';

import UnansweredQueriesModal from '../../components/UnansweredQueriesModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        verified: 0,
        recentUsers: [],
        unanswered: 0
    });
    const [loading, setLoading] = useState(true);
    const [isQueriesModalOpen, setIsQueriesModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, queriesRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/queries')
                ]);

                const users = usersRes.data;
                const queries = queriesRes.data;

                const total = users.length;
                const pending = users.filter(u => u.role === 'alumni' && !u.isVerified).length;
                const verified = users.filter(u => u.role === 'alumni' && u.isVerified).length;

                // Alert Logic: Unanswered Queries
                const unanswered = queries.filter(q => q.responses.length === 0).length;

                // Get 4 most recent users
                const recentUsers = [...users]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);

                setStats({ total, pending, verified, recentUsers, unanswered });
            } catch (error) {
                console.error("Failed to fetch admin dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading admin dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<ShieldAlert className="text-indigo-600" />}
                    label="Pending Verifications"
                    value={stats.pending}
                    trend={stats.pending > 0 ? "Requires Attention" : "All Caught Up"}
                    trendColor={stats.pending > 0 ? "text-indigo-600" : "text-green-600"}
                    to="/admin/verify-users"
                />
                <StatCard
                    icon={<Users className="text-blue-600" />}
                    label="Total Users"
                    value={stats.total}
                    trend="Registered Members"
                    trendColor="text-green-600"
                    to="/admin/users"
                />
                <StatCard
                    icon={<CheckCircle className="text-indigo-600" />}
                    label="Alumni Verified"
                    value={stats.verified}
                    trend="Legitimacy Checked"
                    trendColor="text-blue-600"
                    to="/admin/users"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Registrations */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Registrations</h3>
                        <Link to="/admin/users" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentUsers?.length > 0 ? (
                            stats.recentUsers.map(user => (
                                <div key={user._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.role} • {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-4">No recent registrations.</p>
                        )}
                    </div>
                </section>

                {/* System Alerts */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">System Alerts</h3>
                    </div>

                    <div className="space-y-3">
                        {/* Pending Verifications Alert */}
                        {stats.pending > 0 ? (
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-amber-800 text-sm mb-1">Action Required</h4>
                                    <p className="text-xs text-amber-700">
                                        {stats.pending} alumni account{stats.pending !== 1 && 's'} pending verification.
                                    </p>
                                    <Link to="/admin/verify-users" className="text-xs font-bold text-amber-800 underline mt-1 inline-block">
                                        Review Now
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex gap-3">
                                <CheckCircle className="text-green-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-green-800 text-sm mb-1">All Systems Normal</h4>
                                    <p className="text-xs text-green-600">No pending actions required.</p>
                                </div>
                            </div>
                        )}

                        {/* Unanswered Queries Alert */}
                        {stats.unanswered > 0 && (
                            <div
                                onClick={() => setIsQueriesModalOpen(true)}
                                className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                                <AlertCircle className="text-blue-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-blue-800 text-sm mb-1">Quality Control</h4>
                                    <p className="text-xs text-blue-700">
                                        {stats.unanswered} student quer{stats.unanswered !== 1 ? 'ies' : 'y'} need{stats.unanswered === 1 && 's'} answers.
                                    </p>
                                    <span className="text-xs text-blue-600 italic mt-1 inline-block">Tap to review & nudge.</span>
                                </div>
                            </div>
                        )}

                        {/* Database Status (Mocked but realistic based on app load) */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                            <TrendingUp className="text-slate-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">System Load</h4>
                                <p className="text-xs text-slate-600">Database connection active.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <UnansweredQueriesModal
                isOpen={isQueriesModalOpen}
                onClose={() => setIsQueriesModalOpen(false)}
            />
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, trendColor, to }) => {
    const CardContent = (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${to ? 'cursor-pointer hover:border-blue-300 hover:shadow-md transition-all' : ''}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
                <TrendingUp size={16} className={trendColor} />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-sm font-medium text-slate-500">{label}</div>
            <div className={`text-xs mt-2 font-medium ${trendColor}`}>{trend}</div>
        </motion.div>
    );

    return to ? <Link to={to} className="block">{CardContent}</Link> : CardContent;
};

export default AdminDashboard;
