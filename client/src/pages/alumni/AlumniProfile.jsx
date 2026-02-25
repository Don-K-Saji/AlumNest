import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Mail, Briefcase, MapPin, Save, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from '../../components/EditProfileModal';
import BadgeDisplay from '../../components/BadgeDisplay';
import PageTransition from '../../components/ui/PageTransition';

const AlumniProfile = () => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(authUser);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch latest user data when component mounts
    React.useEffect(() => {
        const fetchLatestUserData = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                console.error("Error fetching latest user data", error);
            }
        };
        fetchLatestUserData();
    }, []);

    if (!user) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <PageTransition className="max-w-4xl mx-auto">
            <div className="mb-8">
                {/* Profile Header - Contained in Blue Background */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 flex items-center gap-6 shadow-lg relative overflow-hidden">
                    {/* Background Pattern/Deco */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    {/* Background Pattern 2 (Alumni specific differentiation - Amber hint) */}
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-inner">
                        {user.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-1.5">{user.name}</h1>
                        <p className="text-blue-100 font-medium text-lg flex items-center gap-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <Briefcase size={14} />
                                {user.jobTitle ? user.jobTitle : 'Alumni'}
                            </span>
                            {user.company && (
                                <span className="opacity-90 flex items-center gap-1">
                                    at <span className="font-semibold text-white">{user.company}</span>
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Edit Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsEditModalOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 flex items-center gap-2 relative z-10"
                    >
                        <Save size={18} />
                        Edit Profile
                    </motion.button>
                </div>
            </div>

            <motion.div
                className="grid md:grid-cols-3 gap-8"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Left Column - Info */}
                <div className="md:col-span-2 space-y-6">
                    <motion.section variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                        <div className="space-y-4">
                            <ProfileField icon={User} label="Full Name" value={user.name} />
                            <ProfileField icon={Mail} label="Email Address" value={user.email} />
                            <ProfileField icon={MapPin} label="Location" value={user.location || 'Not updated'} />
                            {user.bio && (
                                <div className="pt-4 border-t border-slate-100 mt-4">
                                    <h4 className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Bio</h4>
                                    <p className="text-slate-600 leading-relaxed">{user.bio}</p>
                                </div>
                            )}
                        </div>
                    </motion.section>

                    <motion.section variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Professional Details</h3>
                        <div className="space-y-4">
                            <ProfileField icon={Briefcase} label="Current Role" value={`${user.jobTitle || 'N/A'} at ${user.company || 'N/A'}`} />
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <LinkIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">LinkedIn Profile</p>
                                    {user.linkedin ? (
                                        <a
                                            href={user.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                                        >
                                            View Profile
                                        </a>
                                    ) : (
                                        <p className="text-slate-900 font-medium">Not connected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Right Column - Skills & Badges */}
                <div className="space-y-6">
                    <motion.section variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 text-sm">No skills added yet</span>
                            )}
                        </div>
                    </motion.section>

                    <motion.section variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Impact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl text-center flex flex-col justify-center">
                                <div className="text-3xl font-bold text-blue-600">{user.points || 0}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Community Points</div>
                            </div>
                            <BadgeDisplay badge={user.badges?.[user.badges.length - 1] || 'Rookie'} variant="card" size="lg" />
                        </div>
                    </motion.section>
                </div>
            </motion.div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </PageTransition>
    );
};

const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-slate-900 font-medium">{value}</p>
        </div>
    </div>
);

const AlumniNotifications = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Notifications</h2>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500 py-12">
                No new notifications
            </div>
        </div>
    );
};

export { AlumniProfile, AlumniNotifications };
export default AlumniProfile;
