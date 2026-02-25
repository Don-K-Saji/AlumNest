import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, MapPin, Briefcase } from 'lucide-react';
import BadgeDisplay from '../../components/BadgeDisplay';
import AlumniHoverCard from '../../components/AlumniHoverCard';
import api from '../../services/api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const { data } = await api.get('/gamification/leaderboard');
            setLeaders(data);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
            setError("Failed to load leaderboard. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="text-amber-400" size={24} />;
            case 1: return <Medal className="text-slate-400" size={24} />;
            case 2: return <Medal className="text-amber-700" size={24} />;
            default: return <span className="font-bold text-slate-500 w-6 text-center">{index + 1}</span>;
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading leaderboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg mx-6">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Community Hall of Fame
                    </h2>
                    <p className="text-slate-500">Top contributors making a difference in AlumNest</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
                <div className="w-full">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200">
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-20 text-center first:rounded-tl-2xl">Rank</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Alumni</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Badge</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right last:rounded-tr-2xl">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaders.map((alum, index) => (
                                <motion.tr
                                    key={alum._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`hover:bg-slate-50/50 transition-colors ${index < 3 ? 'bg-yellow-50/10' : ''}`}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center">
                                            {getRankIcon(index)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <AlumniHoverCard author={alum} />
                                            <div>
                                                <h4 className="font-bold text-slate-900">{alum.name}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                                    {alum.jobTitle && (
                                                        <span className="flex items-center gap-1"><Briefcase size={10} /> {alum.jobTitle} @ {alum.company}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <td className="px-6 py-4">
                                            <BadgeDisplay badge={alum.badges?.[alum.badges.length - 1] || 'Rookie'} size="sm" />
                                        </td>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono font-bold text-blue-600 text-lg">{alum.points || 0}</span>
                                        <span className="text-xs text-slate-400 ml-1">pts</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
