import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import api from '../../services/api';
import BadgeDisplay from '../../components/BadgeDisplay';

const ViewAlumni = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const { data } = await api.get('/users/alumni');
                setAlumni(data);
            } catch (error) {
                console.error("Failed to fetch alumni", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlumni();
    }, []);

    const filteredAlumni = alumni.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.company && a.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.skills && a.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading alumni directory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Alumni Directory</h2>
                    <p className="text-slate-500">Find and connect with seniors from your domain</p>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, company, or skills..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.length > 0 ? (
                    filteredAlumni.map((alum) => (
                        <div key={alum._id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                    {alum.name[0]}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                        {alum.batch || 'Alumni'}
                                    </span>
                                    {alum.badges && alum.badges.length > 0 && (
                                        <BadgeDisplay badge={alum.badges[alum.badges.length - 1]} size="xs" />
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {alum.name}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-600 mb-4 text-sm">
                                <Briefcase size={14} />
                                <span>{alum.jobTitle || 'Alumni'} at {alum.company || 'N/A'}</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                <MapPin size={14} />
                                <span>{alum.location || 'Remote'}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {alum.skills && alum.skills.length > 0 ? (
                                    alum.skills.map((skill, index) => (
                                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400">No skills listed</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to={`/student/create-query?type=targeted&targetAlumni=${alum._id}&name=${encodeURIComponent(alum.name)}`}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-all"
                                >
                                    Message
                                </Link>
                                <Link
                                    to={`/student/alumni/${alum._id}`}
                                    className="flex items-center justify-center py-2.5 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    Profile
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        No alumni found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAlumni;
