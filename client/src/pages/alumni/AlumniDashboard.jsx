import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Award, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import BadgeDisplay from '../../components/BadgeDisplay';
import PointsProgressWidget from '../../components/PointsProgressWidget';
import PageTransition from '../../components/ui/PageTransition';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

const AlumniDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        answered: 0,
        helpful: 0,
        reputation: 0
    });
    const [recommendedQueries, setRecommendedQueries] = useState([]);
    const [topMentors, setTopMentors] = useState([]);
    const [roadplan, setRoadplan] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Queries
                const { data: queries } = await api.get('/queries');

                // Fetch Latest User Data
                const { data: userData } = await api.get('/auth/me');
                setRoadplan(userData.roadplan || []);

                // Fetch Leaderboard
                const { data: leaderboard } = await api.get('/gamification/leaderboard');
                setTopMentors(leaderboard.slice(0, 5));

                // Calculate Stats
                let answeredCount = 0;
                let helpfulCount = 0;
                queries.forEach(q => {
                    const userResponses = q.responses?.filter(r => r.author === user._id || r.author?._id === user._id) || [];
                    if (userResponses.length > 0) {
                        answeredCount += userResponses.length;
                        userResponses.forEach(r => {
                            if (r.upvotes) {
                                helpfulCount += r.upvotes.length;
                            }
                        });
                    }
                });

                setStats({
                    answered: answeredCount,
                    helpful: helpfulCount,
                    reputation: userData.points || 0
                });

                // Recommended Queries
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

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <PageTransition className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<MessageCircle size={24} />}
                    label="Queries Answered"
                    value={stats.answered}
                    trend="Keep it up!"
                    color="blue"
                />
                <StatCard
                    icon={<ThumbsUp size={24} />}
                    label="Helpful Votes"
                    value={stats.helpful}
                    trend="Based on feedback"
                    color="green"
                />
                <StatCard
                    icon={<Award size={24} />}
                    label="Community Points"
                    value={stats.reputation}
                    trend={`Level ${Math.floor(stats.reputation / 100) + 1} Mentor`}
                    color="amber"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Feed Preview */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recommended for You</h3>
                        <Link to="/alumni/feed" className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Query Cards */}
                    <motion.div
                        className="space-y-4"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {recommendedQueries.length > 0 ? (
                            recommendedQueries.map((q, i) => (
                                <Card
                                    key={q._id}
                                    variant="glass"
                                    className="group cursor-pointer"
                                    variants={item}
                                    whileHover={{ borderColor: 'rgba(59, 130, 246, 0.5)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                >
                                    <div className="flex gap-2 mb-3">
                                        {q.tags && q.tags.map((tag, i) => (
                                            <span key={i} className="text-xs font-medium px-2.5 py-1 bg-slate-100/80 text-slate-600 rounded-lg backdrop-blur-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {q.title}
                                    </h4>
                                    <p className="text-slate-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                                        {q.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-xs font-medium text-slate-400">
                                            Posted by <span className="text-slate-600">{q.author?.name || 'Student'}</span> • {new Date(q.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link to={`/alumni/feed`}>
                                            <Button size="sm" variant="primary">Write Answer</Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card variant="solid" className="text-center py-10">
                                <p className="text-slate-500">No pending queries found.</p>
                            </Card>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar - Leaderboard & Progress */}
                <div className="space-y-6">
                    {/* Points Progress Widget */}
                    <PointsProgressWidget points={stats.reputation} user={user} />

                    <Card variant="solid">
                        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <Award className="text-amber-500" size={20} />
                            Top Mentors
                        </h3>
                        <div className="space-y-4">
                            {topMentors.length > 0 ? (
                                topMentors.map((mentor, i) => (
                                    <div key={mentor._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-100' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-slate-900">{mentor.name}</h5>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <BadgeDisplay badge={mentor.badges?.[mentor.badges.length - 1] || 'Rookie'} size="sm" />
                                                <span className="text-xs text-slate-500 font-medium">• {mentor.points} pts</span>
                                            </div>
                                        </div>
                                        {i === 0 && <Award size={16} className="text-amber-500" />}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No data available yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </PageTransition>
    );
};

export default AlumniDashboard;
