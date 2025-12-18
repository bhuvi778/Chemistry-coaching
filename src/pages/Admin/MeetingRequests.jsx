import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const MeetingRequests = () => {
    const { meetingRequests, deleteMeetingRequest } = useData();
    const [filter, setFilter] = useState('all');

    const filteredRequests = filter === 'all'
        ? meetingRequests
        : meetingRequests.filter(req => req.requestType === filter);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            deleteMeetingRequest(id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeColor = (type) => {
        const colors = {
            'Webinar': 'bg-blue-500/20 text-blue-400',
            'Demo': 'bg-green-500/20 text-green-400',
            'Workshop': 'bg-purple-500/20 text-purple-400',
            'Consultation': 'bg-pink-500/20 text-pink-400',
            'Trial Class': 'bg-orange-500/20 text-orange-400',
            'Doubt Session': 'bg-cyan-500/20 text-cyan-400'
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Meeting Requests</h2>
                    <p className="text-gray-400">Review and manage session requests from users</p>
                </div>
                <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg font-bold">
                    {meetingRequests.length} Total Requests
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition ${filter === 'all'
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    All ({meetingRequests.length})
                </button>
                {['Webinar', 'Demo', 'Workshop', 'Consultation', 'Trial Class', 'Doubt Session'].map(type => {
                    const count = meetingRequests.filter(r => r.requestType === type).length;
                    return (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg transition ${filter === type
                                    ? 'bg-cyan-500 text-black font-bold'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {type} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="glass-panel rounded-xl p-12 text-center">
                    <i className="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-white mb-2">No Requests Found</h3>
                    <p className="text-gray-400">
                        {filter === 'all'
                            ? 'No meeting requests have been submitted yet.'
                            : `No ${filter} requests found.`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <div key={request._id} className="glass-panel rounded-xl p-6 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Left Section - User Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {request.firstName?.[0]}{request.lastName?.[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">
                                                    {request.firstName} {request.lastName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(request.requestType)}`}>
                                                    {request.requestType}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-400">
                                                <p className="flex items-center gap-2">
                                                    <i className="fas fa-envelope w-4"></i>
                                                    <a href={`mailto:${request.email}`} className="hover:text-cyan-400 transition">
                                                        {request.email}
                                                    </a>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <i className="fas fa-phone w-4"></i>
                                                    <a href={`tel:${request.phone}`} className="hover:text-cyan-400 transition">
                                                        {request.phone}
                                                    </a>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <i className="fas fa-clock w-4"></i>
                                                    Submitted: {formatDateTime(request.submittedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferences */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-800/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Preferred Date</p>
                                            <p className="text-white font-semibold">
                                                <i className="fas fa-calendar mr-2 text-cyan-400"></i>
                                                {formatDate(request.preferredDate)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Preferred Time</p>
                                            <p className="text-white font-semibold">
                                                <i className="fas fa-clock mr-2 text-purple-400"></i>
                                                {request.preferredTime || 'Any Time'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {request.message && (
                                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-2">
                                                <i className="fas fa-comment mr-2"></i>
                                                Additional Requirements
                                            </p>
                                            <p className="text-gray-300 text-sm">{request.message}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Section - Actions */}
                                <div className="flex lg:flex-col gap-2">
                                    <button
                                        onClick={() => handleDelete(request._id)}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition flex items-center gap-2"
                                    >
                                        <i className="fas fa-trash"></i>
                                        <span className="hidden sm:inline">Delete</span>
                                    </button>
                                    <a
                                        href={`mailto:${request.email}?subject=Regarding your ${request.requestType} request&body=Hi ${request.firstName},%0D%0A%0D%0AThank you for your interest in our ${request.requestType}.%0D%0A%0D%0A`}
                                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition flex items-center gap-2"
                                    >
                                        <i className="fas fa-envelope"></i>
                                        <span className="hidden sm:inline">Email</span>
                                    </a>
                                    <a
                                        href={`tel:${request.phone}`}
                                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition flex items-center gap-2"
                                    >
                                        <i className="fas fa-phone"></i>
                                        <span className="hidden sm:inline">Call</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Instructions */}
            <div className="mt-8 glass-panel rounded-xl p-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-cyan-400"></i>
                    How to Handle Requests
                </h3>
                <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Review each request and contact the user via email or phone</li>
                    <li>• Discuss their requirements and schedule a suitable time</li>
                    <li>• Use the "Manage Webinar" tab to set up the scheduled session</li>
                    <li>• Delete requests after they've been processed or scheduled</li>
                    <li>• Keep track of user preferences for better scheduling</li>
                </ul>
            </div>
        </div>
    );
};

export default MeetingRequests;
