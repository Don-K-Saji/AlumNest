import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Award } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import BadgeDisplay from '../../components/BadgeDisplay';

const AlumniDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        answered: 0,
        helpful: 0,
        reputation: 0
    });
    const [recommendedQueries, setRecommendedQueries] = useState([]);
    const [topMentors, setTopMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Queries
                const { data: queries } = await api.get('/queries');

                // Fetch Latest User Data (for points/badges)
                const { data: userData } = await api.get('/auth/me');

                // Fetch Leaderboard for Sidebar
                const { data: leaderboard } = await api.get('/gamification/leaderboard');
                setTopMentors(leaderboard.slice(0, 5)); // Take top 5

                // Calculate Stats
                let answeredCount = 0;
                queries.forEach(q => {
                    if (q.responses && q.responses.some(r => r.author === user._id || r.author?._id === user._id)) {
                        answeredCount++;
                    }
                });

                setStats({
                    answered: answeredCount,
                    helpful: 0, // Mock for now
                    reputation: userData.points || 0 // Real DB Value
                });

                // Recommended Queries (Pending ones)
                const pending = queries.filter(q => q.status !== 'Resolved' && q.author !== user._id);
                setRecommendedQueries(pending.slice(0, 3));

            } catch (error) {
                console.error("Error fetching alumni dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-3 gap-6">
                <StatCard
                    icon={<MessageCircle className="text-blue-600" />}
                    label="Queries Answered"
                    value={stats.answered}
                    trend="Keep it up!"
                />
                <StatCard
                    icon={<ThumbsUp className="text-green-600" />}
                    label="Helpful Votes"
                    value={stats.helpful}
                    trend="Based on feedback"
                />
                <StatCard
                    icon={<Award className="text-amber-500" />}
                    label="Community Points"
                    value={stats.reputation}
                    trend={`Level ${Math.floor(stats.reputation / 100) + 1} Mentor`}
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Feed Preview */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Recommended for You</h3>

                    {/* Query Cards */}
                    {recommendedQueries.length > 0 ? (
                        recommendedQueries.map((q) => (
                            <div key={q._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex gap-2 mb-3">
                                    {q.tags && q.tags.map((tag, i) => (
                                        <span key={i} className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {q.title}
                                </h4>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                    {q.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">Posted by {q.author?.name || 'Student'} • {new Date(q.createdAt).toLocaleDateString()}</span>
                                    <Link to={`/alumni/feed`} className="btn-primary text-sm px-4 py-2">
                                        Write Answer
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">No pending queries found.</p>
                    )}
                </div>

                {/* Sidebar - Leaderboard */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Award className="text-amber-500" size={20} />
                            Top Mentors
                        </h3>
                        <div className="space-y-4">
                            {topMentors.length > 0 ? (
                                topMentors.map((mentor, i) => (
                                    <div key={mentor._id} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-slate-900">{mentor.name}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <BadgeDisplay badge={mentor.badges?.[mentor.badges.length - 1] || 'Rookie'} size="sm" />
                                                <span className="text-xs text-slate-500">• {mentor.points} pts</span>
                                            </div>
                                        </div>
                                        {i === 0 && <Award size={16} className="text-amber-500" />}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No data available yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="text-xs text-green-600 mt-2 font-medium">{trend}</div>
    </motion.div>
);

export default AlumniDashboard;
