import React from 'react';

const ActivityLog = ({ activities, className = "" }) => {
    return (
        <div className={`bg-gray-900 text-white p-4 h-screen overflow-y-auto ${className}`}>
            <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
            <div>
                {activities.map((activity, index) => (
                    <div key={index} className="mb-2">
                        <span className="text-gray-500">{activity.timestamp}</span>
                        <span className="ml-2">{activity.studentName}</span>
                        <span className="ml-2">{activity.action}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityLog;
