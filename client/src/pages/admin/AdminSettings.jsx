import React, { useState } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from '../../components/EditProfileModal';

const AdminSettings = () => {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">System Settings</h1>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <User size={20} className="text-slate-400" />
                        Admin Profile
                    </h2>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Edit Details
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <Shield size={14} className="text-blue-500" />
                                <span className="uppercase tracking-wide font-medium text-xs">System Administrator</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 pt-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                            <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                                <Mail size={16} />
                                {user.email}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default AdminSettings;
