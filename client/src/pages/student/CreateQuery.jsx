import React, { useState, useEffect } from 'react';
import { Send, Hash, Target, Globe, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const CreateQuery = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // URL Params for pre-filling (e.g. from Alumni Profile)
    const urlType = searchParams.get('type');
    const urlTargetId = searchParams.get('targetAlumni');
    const urlTargetName = searchParams.get('name');

    const [queryType, setQueryType] = useState(urlType === 'targeted' ? 'targeted' : 'open');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        targetCompany: ''
    });
    const [loading, setLoading] = useState(false);

    // If targeted, we lock the mode
    const isTargetedLocked = urlType === 'targeted' && urlTargetId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                type: queryType === 'company' ? 'category' : queryType, // UI uses 'company' state for now, map to 'category'
                domain: queryType === 'company' ? formData.targetCompany : 'General',
                ...(queryType === 'targeted' && urlTargetId && { targetAlumni: urlTargetId })
            };

            await api.post('/queries', payload);
            navigate('/student/queries');
        } catch (error) {
            console.error("Failed to create query", error);
            alert("Failed to post query. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900">Ask the Community</h2>
                <p className="text-slate-500 mt-2">Get guidance from alumni who have been in your shoes</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                {/* Targeted Header if locked */}
                {isTargetedLocked ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900">Private Question for {urlTargetName || 'Alumni'}</h3>
                            <p className="text-sm text-blue-600">Only you and {urlTargetName || 'this alumni'} can see this conversation.</p>
                        </div>
                    </div>
                ) : (
                    /* Normal Type Selector */
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <QueryTypeOption
                            active={queryType === 'open'}
                            onClick={() => setQueryType('open')}
                            icon={Globe}
                            title="Open Query"
                            desc="Visible to all alumni"
                        />
                        <QueryTypeOption
                            active={queryType === 'company'}
                            onClick={() => setQueryType('company')}
                            icon={Target}
                            title="Target Category"
                            desc="Company, Skill, Role, or Location"
                        />
                        {/* Direct option placeholder removed as we now use profile flows */}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                        <input
                            type="text"
                            required
                            className="input-field bg-slate-50"
                            placeholder="e.g. How to prepare for Google Interviews?"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {queryType === 'company' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target Category</label>
                            <input
                                type="text"
                                className="input-field bg-slate-50"
                                placeholder="e.g. Google, MERN, Product Manager, USA..."
                                value={formData.targetCompany}
                                onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                            />
                            <p className="text-xs text-slate-500 mt-1">Alumni matching this company, skill, role, or location will be notified.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            rows={6}
                            required
                            className="input-field bg-slate-50 resize-none"
                            placeholder="Describe your query in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                        <input
                            type="text"
                            className="input-field bg-slate-50"
                            placeholder="e.g. java, career, placements (Comma separated)"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 px-8 disabled:opacity-50"
                        >
                            <Send size={18} />
                            {loading ? 'Posting...' : 'Post Query'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const QueryTypeOption = ({ active, onClick, icon: Icon, title, desc }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${active
            ? 'border-blue-600 bg-blue-50/50'
            : 'border-slate-100 hover:border-slate-200'
            }`}
    >
        <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-3 ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
            <Icon size={20} />
        </div>
        <h4 className={`font-medium mb-1 ${active ? 'text-blue-900' : 'text-slate-900'}`}>{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
    </div>
);

export default CreateQuery;
