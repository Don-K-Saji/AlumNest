import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Layout, Shield, ArrowRight, MessageCircle, Star, Target, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Navbar Overlay */}
            <nav className="fixed w-full z-50 glass-panel border-b-0 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <GraduationCap size={28} />
                        </div>
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">AlumNest</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 font-medium hover:text-slate-900 transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn-primary shadow-lg shadow-blue-900/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-8 border border-blue-100 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Bridging the gap between Campus & Career
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                            Connect with your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Legacy & Future</span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            A centralized platform for structured mentorship, career guidance, and finding your alumni network.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="btn-primary flex items-center gap-2 group text-lg px-8 py-4 shadow-xl shadow-blue-900/20">
                                Join the Network
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all hover:shadow-lg">
                                Explore Directory
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Ambient Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Statistics Strip */}
            <div className="border-y border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatItem value="5000+" label="Active Alumni" />
                    <StatItem value="120+" label="Top Companies" />
                    <StatItem value="850+" label="Queries Solved" />
                    <StatItem value="Top 10" label="College Ranking" />
                </div>
            </div>

            {/* Core Features - Grid */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why AlumNest?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            We solve the problem of disconnected alumni networks by providing a structured, secure, and engaging platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="text-blue-600" size={32} />}
                            title="Dynamic Alumni Directory"
                            desc="Forget static spreadsheets. Search alumni by company, skill, batch, or location with real-time profile updates."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Target className="text-cyan-600" size={32} />}
                            title="Targeted Guidance"
                            desc="Send queries to specific alumni or groups (e.g., 'Google Employees' or 'Batch of 2022') for relevant advice."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Shield className="text-indigo-600" size={32} />}
                            title="Verified & Secure"
                            desc="Role-based access ensures privacy. Only verified students and alumni can access the internal network."
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* Deep Dive - Interaction Model */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl rotate-3 opacity-20 blur-lg"></div>
                        <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
                            {/* Mock Chat UI */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">S</div>
                                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-slate-300 text-sm">
                                        How prominent is System Design for SDE-1 roles at Amazon?
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0">A</div>
                                    <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-white text-sm shadow-lg">
                                        For SDE-1, focus more on DSA and LLD. System Design is usually for L4+. I can share some resources.
                                    </div>
                                </div>
                                <div className="flex justify-center pt-2">
                                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                                        <Star size={10} className="inline mr-1 text-amber-400" />
                                        Answer marked as Helpful
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs mb-6 uppercase tracking-wider">
                            Structured Interaction
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                            No Spam, Just <span className="text-gradient">Meaningful Mentorship</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            We avoid real-time chat chaos. Instead, we use structured query threads.
                            Post a question, get verified answers, and mark them as helpful.
                        </p>

                        <ul className="space-y-4">
                            {[
                                '3 Modes: Open, Category-based, & Direct Queries',
                                'In-App Notifications for replies',
                                'Optional external connection via LinkedIn/Email'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600"><ArrowRight size={14} /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Gamification Section */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-20 right-0 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl mix-blend-multiply animate-pulse animation-delay-2000"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        whileInView={{ rotate: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="inline-block mb-6"
                    >
                        <div className="p-4 bg-white rounded-full shadow-xl border border-amber-100">
                            <Star className="w-12 h-12 text-amber-500 fill-amber-500" />
                        </div>
                    </motion.div>

                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Recognizing <span className="text-amber-600">Excellence</span></h2>
                    <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
                        Your contributions don't go unnoticed. Earn community points, unlock exclusive badges, and become a verified mentor.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <BadgeCard
                            label="Helpful Hero"
                            desc="Marked informative by 50+ students"
                            color="from-amber-400 to-orange-500"
                            icon={Star}
                            delay={0}
                        />
                        <BadgeCard
                            label="Career Guide"
                            desc="Provided 10+ referrals or career roadmaps"
                            color="from-blue-400 to-cyan-500"
                            icon={Target}
                            delay={0.1}
                        />
                        <BadgeCard
                            label="Tech Wizard"
                            desc="Top contributor in Technical domains"
                            color="from-purple-400 to-indigo-500"
                            icon={Layout}
                            delay={0.2}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-16 inline-flex flex-col items-center"
                    >
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Live Impact</p>
                        <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            12,450
                            <span className="text-2xl text-amber-500 ml-1">+</span>
                        </div>
                        <p className="text-slate-400 font-medium">Points Awarded this Semester</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center bg-slate-900">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <GraduationCap size={24} className="text-white" />
                        <span className="text-xl font-bold text-white">AlumNest</span>
                    </div>
                    <div className="text-sm">
                        &copy; {new Date().getFullYear()} AlumNest Project. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm transition-colors"
    >
        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 text-slate-900 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </motion.div>
);

const StatItem = ({ value, label }) => (
    <div className="p-4">
        <div className="text-4xl font-extrabold text-slate-900 mb-2">{value}</div>
        <div className="text-slate-500 font-medium">{label}</div>
    </div>
);

const BadgeCard = ({ label, desc, color, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
    >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 mx-auto shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {Icon && <Icon size={24} />}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">{label}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>

        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                Level 5 Unlocks
            </span>
        </div>
    </motion.div>
);

export default Landing;
