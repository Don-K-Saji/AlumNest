import React from 'react';
import Card from './Card';

const StatCard = ({
    icon,
    label,
    value,
    trend,
    trendType = 'neutral', // up, down, neutral
    subtext,
    color = 'blue' // blue, green, amber, purple
}) => {

    const colorStyles = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        amber: 'text-amber-600 bg-amber-50',
        purple: 'text-purple-600 bg-purple-50',
        rose: 'text-rose-600 bg-rose-50'
    };

    const selectedColor = colorStyles[color] || colorStyles.blue;

    return (
        <Card hover={true} className="flex flex-col justify-between h-full">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${selectedColor}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-green-100 text-green-700' :
                        trendType === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
            </div>
        </Card>
    );
};

export default StatCard;
