import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Star, Target, MessageCircle, UserCheck, History, Award } from 'lucide-react';
import api from '../services/api';
import moment from 'moment';

const PointsHistoryModal = ({ isOpen, onClose, points, level, user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users/gamification/history');
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    // Define earnable actions
    const earnActions = [
        { icon: UserCheck, label: 'Complete Profile', points: 50, completed: user?.isProfileCompleteAwarded },
        { icon: MessageCircle, label: 'Answer a Query', points: 20, completed: false },
        { icon: CheckCircle2, label: 'Get Answer Accepted', points: 50, completed: false },
        { icon: Star, label: 'Receive a Like', points: 10, completed: false },
    ];

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    />

                    {/* Modal */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header with Gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative shrink-0">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold">Your Journey</h2>
                                        <p className="text-blue-100 opacity-90 font-medium">Current Level: {level.label}</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-6 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{points}</span>
                                    <span className="text-blue-200">Total Points</span>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {/* Recent Activity Section */}
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <History size={16} /> Recent Activity
                                </h3>

                                <div className="space-y-3 mb-8">
                                    {loading ? (
                                        <p className="text-sm text-slate-500 text-center py-4">Loading history...</p>
                                    ) : history.length > 0 ? (
                                        history.map((item) => (
                                            <div key={item._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="p-2 bg-white rounded-full text-indigo-500 shadow-sm">
                                                    <Award size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-slate-900 font-medium text-sm">{item.action}</p>
                                                    <p className="text-xs text-slate-400">{moment(item.createdAt).fromNow()}</p>
                                                </div>
                                                <span className={`font-bold text-sm ${item.points >= 0 ? 'text-green-600' : 'text-rose-500'}`}>
                                                    {item.points > 0 ? '+' : ''}{item.points} pts
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-slate-500 text-sm">No points history yet.</p>
                                        </div>
                                    )}
                                </div>


                                {/* How to Earn Section */}
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Target size={16} /> How to Earn
                                </h3>

                                <div className="space-y-3">
                                    {earnActions.map((action, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${action.completed
                                                ? 'bg-green-50 border-green-100 opacity-60'
                                                : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className={`p-2.5 rounded-full ${action.completed ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'
                                                }`}>
                                                <action.icon size={20} />
                                            </div>

                                            <div className="flex-1">
                                                <p className={`font-semibold ${action.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {action.label}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${action.completed ? 'bg-green-200 text-green-800' : 'bg-indigo-100 text-indigo-700'
                                                        }`}>
                                                        +{action.points} pts
                                                    </span>
                                                    {action.completed && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Done</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default PointsHistoryModal;
