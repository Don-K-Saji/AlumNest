import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, Star, Zap } from 'lucide-react';
import PointsHistoryModal from './PointsHistoryModal';

const PointsProgressWidget = ({ points = 0, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Level Logic
    // Level 1: 0-100
    // Level 2: 101-300
    // Level 3: 301-600
    // Level 4: 601-1000
    // Level 5: 1000+
    const levels = [
        { level: 1, min: 0, max: 100, label: "Rookie" },
        { level: 2, min: 101, max: 300, label: "Contributor" },
        { level: 3, min: 301, max: 600, label: "Mentor" },
        { level: 4, min: 601, max: 1000, label: "Expert" },
        { level: 5, min: 1001, max: 10000, label: "Legend" }
    ];

    const currentLevel = levels.find(l => points >= l.min && points <= l.max) || levels[levels.length - 1];
    const nextLevel = levels.find(l => l.level === currentLevel.level + 1);

    const progress = nextLevel
        ? Math.min(100, Math.max(0, ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100))
        : 100; // Max level reached

    return (
        <>
            <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer group relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                <Trophy className="text-amber-500" size={20} />
                                Your Progress
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">
                                Level {currentLevel.level} • {currentLevel.label}
                            </p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="flex items-end gap-1 mb-2">
                        <span className="text-3xl font-bold text-slate-900">{points}</span>
                        <span className="text-sm text-slate-500 mb-1.5 font-medium">/ {nextLevel ? nextLevel.min : 'Max'} pts</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                        {/* Animated Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-white/30 skew-x-12 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        </motion.div>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                        <Zap size={12} className="text-amber-500 fill-amber-500" />
                        {nextLevel
                            ? `${nextLevel.min - points} points to reach Level ${nextLevel.level}`
                            : "You're at the top!"}
                    </p>
                </div>
            </motion.div>

            <PointsHistoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                points={points}
                level={currentLevel}
                user={user}
            />
        </>
    );
};

export default PointsProgressWidget;
