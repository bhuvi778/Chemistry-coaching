import { useState, useEffect } from 'react';
import axios from 'axios';

const ManageTestRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState('all');
    const [tests, setTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        attempted: 0,
        notAttempted: 0
    });

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchTests();
        fetchRegistrations();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await axios.get(`${API_URL}/practice-tests/admin/tests`);
            setTests(response.data || []);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/practice-tests/admin/registrations`);
            // Filter to show only attempted tests
            const attemptedOnly = (response.data || []).filter(reg => reg.hasAttempted);
            setRegistrations(attemptedOnly);
            calculateStats(attemptedOnly);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTestRegistrations = async (testId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/practice-tests/admin/tests/${testId}/registrations`);
            // Filter to show only attempted tests
            const attemptedOnly = (response.data.registrations || []).filter(reg => reg.hasAttempted);
            setRegistrations(attemptedOnly);
            setStats({
                total: attemptedOnly.length,
                attempted: attemptedOnly.length,
                notAttempted: 0
            });
        } catch (error) {
            console.error('Error fetching test registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        setStats({
            total: data.length,
            attempted: data.length,
            notAttempted: 0
        });
    };

    const handleTestFilter = (testId) => {
        setSelectedTest(testId);
        if (testId === 'all') {
            fetchRegistrations();
        } else {
            fetchTestRegistrations(testId);
        }
    };

    const handleDelete = async (registrationId) => {
        if (!confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/practice-tests/admin/registrations/${registrationId}`);
            // Refresh the list
            if (selectedTest === 'all') {
                fetchRegistrations();
            } else {
                fetchTestRegistrations(selectedTest);
            }
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Failed to delete registration');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredRegistrations = registrations.filter(reg => {
        const searchLower = searchTerm.toLowerCase();
        return (
            reg.name?.toLowerCase().includes(searchLower) ||
            reg.email?.toLowerCase().includes(searchLower) ||
            reg.mobile?.includes(searchTerm) ||
            reg.testId?.title?.toLowerCase().includes(searchLower)
        );
    });

    if (loading && registrations.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Test Attempts
                    </h1>
                    <p className="text-gray-400">View users who have attempted tests</p>
                </div>

                {/* Stats Card */}
                <div className="glass-panel rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Attempts</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <i className="fas fa-check-circle text-white text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-panel rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Test Filter */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                <i className="fas fa-filter mr-2 text-cyan-400"></i>
                                Filter by Test
                            </label>
                            <select
                                value={selectedTest}
                                onChange={(e) => handleTestFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                            >
                                <option value="all">All Tests</option>
                                {tests.map(test => (
                                    <option key={test._id} value={test._id}>
                                        {test.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                <i className="fas fa-search mr-2 text-cyan-400"></i>
                                Search
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Name, email, mobile..."
                                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="glass-panel rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        User Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Test
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Registered On
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            <i className="fas fa-inbox text-4xl mb-4 block"></i>
                                            <p>No test attempts found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg._id} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-white font-semibold">{reg.name}</p>
                                                    <p className="text-sm text-gray-400">
                                                        <i className="fas fa-envelope mr-2"></i>
                                                        {reg.email}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        <i className="fas fa-phone mr-2"></i>
                                                        {reg.mobile}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {reg.testId?.title || 'N/A'}
                                                    </p>
                                                    {reg.testId?.examType && (
                                                        <span className="inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                                            {reg.testId.examType}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-300 text-sm">
                                                    {formatDate(reg.registeredAt)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.result ? (
                                                    <div>
                                                        <p className="text-white font-bold text-lg">
                                                            {reg.result.marksObtained}/{reg.result.totalMarks}
                                                        </p>
                                                        <p className={`text-sm font-semibold ${reg.result.percentage >= 75 ? 'text-green-400' :
                                                            reg.result.percentage >= 50 ? 'text-yellow-400' :
                                                                'text-red-400'
                                                            }`}>
                                                            {reg.result.percentage.toFixed(2)}%
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Time: {Math.floor(reg.result.timeTaken / 60)}m {reg.result.timeTaken % 60}s
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No result found</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(reg._id)}
                                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold"
                                                >
                                                    <i className="fas fa-trash mr-2"></i>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Count */}
                {filteredRegistrations.length > 0 && (
                    <div className="mt-4 text-center text-gray-400">
                        Showing {filteredRegistrations.length} of {registrations.length} attempts
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTestRegistrations;
