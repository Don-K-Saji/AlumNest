import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const RoadplanWidget = ({ roadplan, setRoadplan }) => {
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(false);

    const calculateProgress = () => {
        if (!roadplan || roadplan.length === 0) return 0;
        const completed = roadplan.filter(item => item.completed).length;
        return Math.round((completed / roadplan.length) * 100);
    };

    const handleUpdate = async (updatedPlan) => {
        try {
            setLoading(true);
            const { data } = await api.put('/auth/roadplan', { roadplan: updatedPlan });
            setRoadplan(data);
        } catch (error) {
            console.error("Failed to update roadplan", error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const updatedPlan = [...roadplan, { title: newItem, completed: false }];
        await handleUpdate(updatedPlan);
        setNewItem('');
    };

    const toggleItem = async (index) => {
        const updatedPlan = [...roadplan];
        updatedPlan[index].completed = !updatedPlan[index].completed;
        await handleUpdate(updatedPlan);
    };

    const deleteItem = async (index) => {
        const updatedPlan = roadplan.filter((_, i) => i !== index);
        await handleUpdate(updatedPlan);
    };

    const progress = calculateProgress();

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">My Roadplan</h3>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Progress</span>
                    <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {roadplan.map((item, index) => (
                    <div key={index} className="flex items-center group">
                        <button
                            onClick={() => toggleItem(index)}
                            disabled={loading}
                            className={`flex-shrink-0 mr-3 transition-colors ${item.completed ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}
                        >
                            {item.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                        </button>
                        <span className={`flex-1 text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {item.title}
                        </span>
                        <button
                            onClick={() => deleteItem(index)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {roadplan.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-2">No items yet. Add your first goal!</p>
                )}
            </div>

            {/* Add Item Input */}
            <form onSubmit={addItem} className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new goal..."
                    className="flex-1 bg-slate-50 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <button
                    type="submit"
                    disabled={!newItem.trim() || loading}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus size={20} />
                </button>
            </form>
        </div>
    );
};

export default RoadplanWidget;
