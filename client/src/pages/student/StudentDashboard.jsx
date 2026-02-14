import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { MessageSquare, Users, CheckCircle, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                // Note: Assuming 'resolved' status exists or using responses length > 0 logic
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
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
                <StatCard
                    icon={<MessageSquare className="text-blue-600" />}
                    label="Total Queries"
                    value={stats.totalQueries}
                    trend="Platform wide"
                />
                <StatCard
                    icon={<CheckCircle className="text-green-600" />}
                    label="Resolved"
                    value={stats.solvedQueries}
                    trend="Questions answered"
                />
                <StatCard
                    icon={<Users className="text-purple-600" />}
                    label="Alumni Available"
                    value={stats.connections}
                    trend="Ready to mentor"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Queries</h3>
                        <Link to="/student/queries" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
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
                    </div>
                </section>

                {/* Recommended Alumni */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recommended Mentors</h3>
                        <Link to="/student/alumni" className="text-sm text-blue-600 font-medium hover:underline">Find More</Link>
                    </div>

                    <div className="space-y-4">
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
                    </div>
                </section>
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
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> Live
            </span>
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="text-xs text-slate-400 mt-2">{trend}</div>
    </motion.div>
);

const ActivityItem = ({ title, status, time }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
        <div className={`w-2 h-2 rounded-full ${status === 'Answered' || status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
        <div className="flex-1">
            <h4 className="font-medium text-slate-900 line-clamp-1">{title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{status}</span>
                <span>•</span>
                <span>{time}</span>
            </div>
        </div>
        <Link to="/student/queries" className="ml-auto">
            <ArrowUpRight size={16} className="text-slate-400 hover:text-blue-600" />
        </Link>
    </div>
);

const MentorItem = ({ id, name, role }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
            {name[0]}
        </div>
        <div>
            <h4 className="font-medium text-slate-900">{name}</h4>
            <p className="text-xs text-slate-500">{role}</p>
        </div>
        <Link
            to={`/student/alumni/${id}`}
            className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
        >
            View
        </Link>
    </div>
);

export default StudentDashboard;
