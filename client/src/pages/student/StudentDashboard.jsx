import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { MessageSquare, Users, CheckCircle, ArrowUpRight, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/ui/PageTransition';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalQueries: 0,
        solvedQueries: 0,
        connections: 0
    });
    const [recentQueries, setRecentQueries] = useState([]);
    const [recommendedAlumni, setRecommendedAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetching for performance
                const [queriesRes, alumniRes] = await Promise.all([
                    api.get('/queries'),
                    api.get('/users/alumni')
                ]);

                const queries = queriesRes.data;
                const alumni = alumniRes.data;

                // Calculate Stats
                const userQueries = queries.filter(q => q.author === user._id || q.author?._id === user._id);
                const solvedCount = userQueries.filter(q => q.status === 'Resolved' || q.responses?.length > 0).length;

                setStats({
                    totalQueries: queries.length, // Or userQueries.length if we only show their own
                    solvedQueries: solvedCount,
                    connections: alumni.length // Placeholder for connections
                });

                // Recent Activity (All queries for now, or just user's)
                setRecentQueries(queries.slice(0, 3));

                // Recommended Alumni (Random or first 3)
                setRecommendedAlumni(alumni.slice(0, 3));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading your dashboard...</div>;
    }

    return (
        <PageTransition className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<MessageSquare size={24} />}
                    label="Total Queries"
                    value={stats.totalQueries}
                    subtext="Platform wide"
                    trend="Live"
                    trendType="up"
                    color="blue"
                />
                <StatCard
                    icon={<CheckCircle size={24} />}
                    label="Resolved"
                    value={stats.solvedQueries}
                    subtext="Questions answered"
                    trend="Verified"
                    trendType="up"
                    color="green"
                />
                <StatCard
                    icon={<Users size={24} />}
                    label="Alumni Available"
                    value={stats.connections}
                    subtext="Ready to mentor"
                    trend="Active"
                    trendType="up"
                    color="purple"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card variant="glass" className="h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Queries</h3>
                        <Link to="/student/queries" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <motion.div
                        className="space-y-4"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {recentQueries.length > 0 ? (
                            recentQueries.map((query) => (
                                <ActivityItem
                                    key={query._id}
                                    title={query.title}
                                    status={query.status || (query.responses?.length > 0 ? 'Answered' : 'Pending')}
                                    time={new Date(query.createdAt).toLocaleDateString()}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No queries posted yet. Be the first!</p>
                        )}
                    </motion.div>
                </Card>

                {/* Recommended Alumni */}
                <Card variant="glass" className="h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recommended Mentors</h3>
                        <Link to="/student/alumni" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                            Find More <ArrowRight size={14} />
                        </Link>
                    </div>

                    <motion.div
                        className="space-y-4"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {recommendedAlumni.length > 0 ? (
                            recommendedAlumni.map((alum) => (
                                <MentorItem
                                    key={alum._id}
                                    id={alum._id}
                                    name={alum.name}
                                    role={`${alum.jobTitle || 'Alumni'} @ ${alum.company || 'N/A'}`}
                                    expertise={alum.skills || []} // Assuming skills array exists
                                />
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No alumni found yet.</p>
                        )}
                    </motion.div>
                </Card>
            </div>
        </PageTransition>
    );
};

// Animation Variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
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

const ActivityItem = ({ title, status, time }) => (
    <motion.div
        variants={item}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm cursor-pointer group"
    >
        <div className={`w-2.5 h-2.5 rounded-full ${status === 'Answered' || status === 'Resolved' ? 'bg-green-500 shadow-green-500/50 shadow-sm' : 'bg-amber-500 shadow-amber-500/50 shadow-sm'}`}></div>
        <div className="flex-1">
            <h4 className="font-medium text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className={`px-1.5 py-0.5 rounded ${status === 'Answered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{status}</span>
                <span>•</span>
                <span>{time}</span>
            </div>
        </div>
        <Link to="/student/queries">
            <Button variant="ghost" size="sm" className="!p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} />
            </Button>
        </Link>
    </motion.div>
);

const MentorItem = ({ id, name, role }) => (
    <motion.div
        variants={item}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-purple-100 hover:shadow-sm cursor-pointer group"
    >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold shadow-inner group-hover:scale-105 transition-transform">
            {name[0]}
        </div>
        <div>
            <h4 className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">{name}</h4>
            <p className="text-xs text-slate-500">{role}</p>
        </div>
        <Link to={`/student/alumni/${id}`} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" className="!px-3 !py-1 text-xs">View</Button>
        </Link>
    </motion.div>
);

export default StudentDashboard;
