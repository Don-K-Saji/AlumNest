import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentQueries = () => {
    const { user } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const { data } = await api.get('/queries');
                // Filter to only show queries by this student
                // (Ideally backend should support /queries/my endpoint, but filtering here works for MVP)
                const myQueries = data.filter(q => q.author === user._id || q.author?._id === user._id);
                setQueries(myQueries);
            } catch (error) {
                console.error("Failed to fetch queries", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchQueries();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading your queries...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">My Queries</h2>

            <div className="space-y-4">
                {queries.length > 0 ? (
                    queries.map((q) => (
                        <div key={q._id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{q.title}</h3>
                                    <div className="flex gap-2">
                                        {q.tags && q.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${q.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {q.status === 'Resolved' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                    {q.status || 'Pending'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100">
                                <span className="flex items-center gap-1">
                                    <MessageCircle size={16} /> {q.responses ? q.responses.length : 0} Responses
                                </span>
                                <span>•</span>
                                <span>Posted {new Date(q.createdAt).toLocaleDateString()}</span>

                                <Link
                                    to={`/student/queries/${q._id}`}
                                    className="ml-auto text-blue-600 font-medium hover:underline"
                                >
                                    View Discussion
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500">You haven't asked any queries yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentQueries;
