import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ProfileUpload from './Pages/ProfileUpload';
import AdminDashboard from './Pages/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute'; // Import protected route

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfileUpload />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
