import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

interface Session {
    adminId: string;
    token: string;
}

const AdminDashboard: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [showTokens, setShowTokens] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/sessions', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSessions(response.data.activeSessions);
            } catch (error) {
                alert('Failed to fetch sessions');
            }
        };

        fetchSessions();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.post(
                '/logout',
                { adminId: sessions?.[0]?.adminId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.removeItem('token');
            alert('Logged out');
            navigate('/');
            window.location.reload();
        } catch (error) {
            alert('Logout failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Admin Dashboard</h2>

                <button 
                    onClick={handleLogout} 
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition mb-4"
                >
                    Force Logout
                </button>

                <h3 className="text-xl font-semibold text-gray-700 mb-4">Active Sessions:</h3>

                {sessions.length > 0 ? (
                    <ul className="space-y-4">
                        {sessions.map((session, index) => (
                            <li key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
                                <p className="text-gray-700"><strong>Admin ID:</strong> {session.adminId}</p>
                                <p className="text-gray-700">
                                    <strong>Token:</strong>{' '}
                                    {showTokens ? session.token : '••••••••••••••••'}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center">No active sessions</p>
                )}

                {sessions.length > 0 && (
                    <button 
                        onClick={() => setShowTokens(!showTokens)} 
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        {showTokens ? 'Hide Tokens' : 'Show Tokens'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
