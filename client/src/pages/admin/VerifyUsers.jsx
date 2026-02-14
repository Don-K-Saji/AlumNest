import React, { useEffect, useState } from 'react';
import { Check, X, Building, GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const VerifyUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const { data } = await api.get('/admin/users');
            const pending = data.filter(u => u.role === 'alumni' && !u.isVerified);
            setPendingUsers(pending);
        } catch (error) {
            console.error("Failed to fetch pending users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/users/${id}/verify`);
            // Optimistic Update
            setPendingUsers(pendingUsers.filter(u => u._id !== id));
        } catch (error) {
            console.error("Failed to approve user", error);
            alert("Failed to verify user");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Rejecting will delete this user account. Are you sure?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setPendingUsers(pendingUsers.filter(u => u._id !== id));
        } catch (error) {
            console.error("Failed to reject user", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading requests...</div>;

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Verification Requests</h2>
                    <p className="text-slate-500">Review and approve new member registrations</p>
                </div>
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
                    {pendingUsers.length} Pending
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {pendingUsers.length > 0 ? (
                    pendingUsers.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-600 uppercase">
                                        {user.name ? user.name[0] : 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                                            Alumni
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl mb-6">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Building size={16} className="text-slate-400" />
                                    <span className="font-medium">{user.jobTitle || 'N/A'} @ {user.company || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <GraduationCap size={16} className="text-slate-400" />
                                    <span>Batch {user.batch || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span>{user.location || 'Unknown Location'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                                    onClick={() => handleReject(user._id)}
                                >
                                    <X size={18} /> Reject
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                                    onClick={() => handleApprove(user._id)}
                                >
                                    <Check size={18} /> Approve
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-white rounded-xl border border-slate-200 text-slate-500">
                        No pending verifications. All good!
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyUsers;
