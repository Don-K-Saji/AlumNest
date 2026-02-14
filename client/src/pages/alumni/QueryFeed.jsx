import React, { useState, useEffect } from 'react';
import { Filter, Edit2, Check, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const QueryFeed = () => {
    const { user } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({}); // Map query ID to text
    const [submitting, setSubmitting] = useState({}); // Map query ID to boolean

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const { data } = await api.get('/queries');
            // Show all queries, or maybe filter pending ones? For now, showing all.
            // Sorting by date descending
            const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setQueries(sorted);
        } catch (error) {
            console.error("Failed to fetch queries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReplyChange = (id, text) => {
        setReplyText(prev => ({ ...prev, [id]: text }));
    };

    const [editingResponse, setEditingResponse] = useState(null); // ID of response being edited
    const [editContent, setEditContent] = useState("");

    const startEditing = (response) => {
        setEditingResponse(response._id);
        setEditContent(response.content);
    };

    const cancelEditing = () => {
        setEditingResponse(null);
        setEditContent("");
    };

    const saveEdit = async (responseId, queryId) => {
        try {
            await api.put(`/queries/responses/${responseId}`, { content: editContent });

            // Update local state without full refetch for speed
            setQueries(prevQueries => prevQueries.map(q => {
                if (q._id !== queryId) return q;
                return {
                    ...q,
                    responses: q.responses.map(r => r._id === responseId ? { ...r, content: editContent } : r)
                };
            }));

            setEditingResponse(null);
        } catch (error) {
            console.error("Failed to update response", error);
            alert("Failed to update response");
        }
    };

    const submitReply = async (queryId) => {
        const text = replyText[queryId];
        if (!text || !text.trim()) return;

        setSubmitting(prev => ({ ...prev, [queryId]: true }));
        try {
            await api.post(`/queries/${queryId}/responses`, {
                content: text
            });
            // Refresh queries to show the new response (or optimistically update)
            await fetchQueries();
            setReplyText(prev => ({ ...prev, [queryId]: '' }));
        } catch (error) {
            console.error("Failed to submit reply", error);
            alert("Failed to post answer");
        } finally {
            setSubmitting(prev => ({ ...prev, [queryId]: false }));
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading query feed...</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Student Queries</h2>
                    <p className="text-slate-500">Help students by sharing your experience</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                    <Filter size={18} /> Filters
                </button>
            </div>

            <div className="space-y-6">
                {queries.length > 0 ? (
                    queries.map((q) => (
                        <div key={q._id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
                                    {q.author?.name ? q.author.name[0] : 'S'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                                                {q.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-4">
                                                {q.author?.name || 'Student'} • {q.author?.batch || 'Unknown Batch'} • {new Date(q.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${q.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {q.status || 'Open'}
                                        </span>
                                    </div>

                                    <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
                                        {q.description}
                                    </p>

                                    {/* Existing Responses */}
                                    {q.responses && q.responses.length > 0 && (
                                        <div className="mb-6 space-y-4 pl-4 border-l-2 border-slate-100">
                                            {q.responses.map((resp, idx) => (
                                                <div key={idx} className="bg-slate-50 p-4 rounded-lg group/response">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-800">{resp.author?.name || 'Alumni'}</span>
                                                            <span className="text-xs text-slate-400">{new Date(resp.createdAt).toLocaleDateString()}</span>
                                                        </div>

                                                        {/* Edit Button for Owner */}
                                                        {resp.author?._id === user?._id && !editingResponse && (
                                                            <button
                                                                onClick={() => startEditing(resp)}
                                                                className="opacity-0 group-hover/response:opacity-100 p-1 hover:bg-slate-200 rounded transition-all text-slate-500"
                                                                title="Edit Response"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Content or Edit Form */}
                                                    {editingResponse === resp._id ? (
                                                        <div className="mt-2">
                                                            <textarea
                                                                className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                                                rows={3}
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                            ></textarea>
                                                            <div className="flex gap-2 mt-2 justify-end">
                                                                <button
                                                                    onClick={cancelEditing}
                                                                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                                                                >
                                                                    <X size={14} /> Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => saveEdit(resp._id, q._id)}
                                                                    className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                                                                >
                                                                    <Check size={14} /> Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{resp.content}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Box */}
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <textarea
                                            className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 resize-none h-24"
                                            placeholder="Write your answer here..."
                                            value={replyText[q._id] || ''}
                                            onChange={(e) => handleReplyChange(q._id, e.target.value)}
                                        ></textarea>
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
                                            <div className="text-xs text-slate-400">Markdown supported</div>
                                            <button
                                                className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
                                                onClick={() => submitReply(q._id)}
                                                disabled={submitting[q._id] || !replyText[q._id]}
                                            >
                                                {submitting[q._id] ? 'Posting...' : 'Post Answer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-slate-500 py-10">No queries found. Great job!</p>
                )}
            </div>
        </div>
    );
};

export default QueryFeed;
