import React, { useState } from 'react';
import { User, Mail, GraduationCap, MapPin, Save, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from '../../components/EditProfileModal';

const StudentProfile = () => {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                {/* Profile Header - Contained in Blue Background */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 flex items-center gap-6 shadow-lg relative overflow-hidden">
                    {/* Background Pattern/Deco (Optional, keeps it subtle) */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-inner">
                        {user.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-1.5">{user.name}</h1>
                        <p className="text-blue-100 font-medium text-lg flex items-center gap-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10">
                                {user.department ? user.department : 'Student'}
                            </span>
                            {user.batch && (
                                <span className="opacity-80">• Batch of {user.batch}</span>
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

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Info */}
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>

                        <div className="space-y-4">
                            <ProfileField icon={User} label="Full Name" value={user.name} />
                            <ProfileField icon={Mail} label="Email Address" value={user.email} />
                            <ProfileField icon={GraduationCap} label="Department" value={user.department || 'Not updated'} />
                            <ProfileField icon={MapPin} label="Location" value={user.location || 'Not updated'} />
                            {user.bio && (
                                <div className="pt-4 border-t border-slate-100 mt-4">
                                    <h4 className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Bio</h4>
                                    <p className="text-slate-600 leading-relaxed">{user.bio}</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column - Skills/Badges */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
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
                    </section>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
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

export default StudentProfile;
