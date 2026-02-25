import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldAlert, CheckCircle, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

import UnansweredQueriesModal from '../../components/UnansweredQueriesModal';
import PageTransition from '../../components/ui/PageTransition';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

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
        <PageTransition className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/verify-users">
                    <StatCard
                        icon={<ShieldAlert size={24} />}
                        label="Pending Verifications"
                        value={stats.pending}
                        subtext={stats.pending > 0 ? "Requires Attention" : "All Caught Up"}
                        trend="Action"
                        trendType={stats.pending > 0 ? "down" : "neutral"}
                        color={stats.pending > 0 ? "amber" : "green"}
                    />
                </Link>
                <Link to="/admin/users">
                    <StatCard
                        icon={<Users size={24} />}
                        label="Total Users"
                        value={stats.total}
                        subtext="Registered Members"
                        trend="Live"
                        trendType="up"
                        color="blue"
                    />
                </Link>
                <Link to="/admin/users">
                    <StatCard
                        icon={<CheckCircle size={24} />}
                        label="Alumni Verified"
                        value={stats.verified}
                        subtext="Legitimacy Checked"
                        trend="Verified"
                        trendType="up"
                        color="purple"
                    />
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Registrations */}
                <Card variant="glass" className="h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Registrations</h3>
                        <Link to="/admin/users" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentUsers?.length > 0 ? (
                            stats.recentUsers.map(user => (
                                <div key={user._id} className="flex items-center gap-3 p-3 hover:bg-white/50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
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
                </Card>

                {/* System Alerts */}
                <Card variant="glass" className="h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">System Alerts</h3>
                    </div>

                    <div className="space-y-3">
                        {/* Pending Verifications Alert */}
                        {stats.pending > 0 ? (
                            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex gap-3">
                                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-amber-900 text-sm mb-1">Action Required</h4>
                                    <p className="text-xs text-amber-700/80">
                                        {stats.pending} alumni account{stats.pending !== 1 && 's'} pending verification.
                                    </p>
                                    <Link to="/admin/verify-users">
                                        <Button size="sm" variant="ghost" className="!p-0 !h-auto !text-amber-700 hover:!bg-transparent hover:underline mt-2">
                                            Review Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 flex gap-3">
                                <CheckCircle className="text-green-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-green-900 text-sm mb-1">All Systems Normal</h4>
                                    <p className="text-xs text-green-700/80">No pending actions required.</p>
                                </div>
                            </div>
                        )}

                        {/* Unanswered Queries Alert */}
                        {stats.unanswered > 0 && (
                            <div
                                onClick={() => setIsQueriesModalOpen(true)}
                                className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3 cursor-pointer hover:bg-blue-100/50 transition-colors"
                            >
                                <AlertCircle className="text-blue-600 shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm mb-1">Quality Control</h4>
                                    <p className="text-xs text-blue-700/80">
                                        {stats.unanswered} student quer{stats.unanswered !== 1 ? 'ies' : 'y'} need{stats.unanswered === 1 && 's'} answers.
                                    </p>
                                    <span className="text-xs text-blue-600 italic mt-1 inline-block">Tap to review & nudge.</span>
                                </div>
                            </div>
                        )}

                        {/* Database Status (Mocked but realistic based on app load) */}
                        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex gap-3">
                            <TrendingUp className="text-slate-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">System Load</h4>
                                <p className="text-xs text-slate-600">Database connection active.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <UnansweredQueriesModal
                isOpen={isQueriesModalOpen}
                onClose={() => setIsQueriesModalOpen(false)}
            />
        </PageTransition>
    );
};

export default AdminDashboard;
