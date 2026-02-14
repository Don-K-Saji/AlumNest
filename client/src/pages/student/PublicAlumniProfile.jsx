import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, MapPin, Link as LinkIcon, ArrowLeft, GraduationCap, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import BadgeDisplay from '../../components/BadgeDisplay';

const PublicAlumniProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alum, setAlum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlum = async () => {
            try {
                const { data } = await api.get(`/users/${id}`);
                setAlum(data);
            } catch (error) {
                console.error("Failed to fetch alumni profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAlum();
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
    if (!alum) return <div className="p-8 text-center text-slate-500">Alumni not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="mb-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 flex items-center gap-6 shadow-lg relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-inner">
                        {alum.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-1.5">{alum.name}</h1>
                        <p className="text-blue-100 font-medium text-lg flex items-center gap-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <Briefcase size={14} />
                                {alum.jobTitle ? alum.jobTitle : 'Alumni'}
                            </span>
                            {alum.company && (
                                <span className="opacity-90 flex items-center gap-1">
                                    at <span className="font-semibold text-white">{alum.company}</span>
                                </span>
                            )}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 relative z-10 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/student/create-query?type=targeted&targetAlumni=${alum._id}&name=${encodeURIComponent(alum.name)}`)}
                                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 flex items-center gap-2 border border-blue-100"
                            >
                                <User size={18} />
                                Ask Private Question
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Info */}
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                            <div className="space-y-4">
                                <ProfileField icon={User} label="Full Name" value={alum.name} />
                                <ProfileField icon={Mail} label="Email Address" value={alum.email} />
                                {alum.batch && <ProfileField icon={GraduationCap} label="Batch" value={alum.batch} />}
                                {alum.department && <ProfileField icon={Building} label="Department" value={alum.department} />}
                                <ProfileField icon={MapPin} label="Location" value={alum.location || 'Not updated'} />
                                {alum.bio && (
                                    <div className="pt-4 border-t border-slate-100 mt-4">
                                        <h4 className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Bio</h4>
                                        <p className="text-slate-600 leading-relaxed">{alum.bio}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Skills & Badges */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {alum.skills && alum.skills.length > 0 ? (
                                    alum.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 text-sm">No skills added yet</span>
                                )}
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Impact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl text-center flex flex-col justify-center">
                                    <div className="text-3xl font-bold text-blue-600">{alum.points || 0}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Community Points</div>
                                </div>
                                <BadgeDisplay badge={alum.badges?.[alum.badges.length - 1] || 'Rookie'} variant="card" size="lg" />
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <LinkIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">LinkedIn Profile</p>
                                    {alum.linkedin ? (
                                        <a
                                            href={alum.linkedin}
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
                        </section>
                    </div>
                </div>
            </div>
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

export default PublicAlumniProfile;
