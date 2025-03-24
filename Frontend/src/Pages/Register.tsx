import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

interface Role {
    id: number;
    name: string;
}

interface Country {
    id: number;
    name: string;
}

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [country, setCountry] = useState('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const navigate = useNavigate();

    // Fetch roles & countries when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesResponse, countriesResponse] = await Promise.all([
                    api.get('/roles'), // API for fetching roles
                    api.get('/countries'), // API for fetching countries
                ]);

                setRoles(rolesResponse.data); // Store the array of role objects
                setCountries(countriesResponse.data); // Store the array of country objects
                setRole(rolesResponse.data[0]?.id.toString() || ''); // Set default role as first item's id
                setCountry(countriesResponse.data[0]?.id.toString() || ''); // Set default country as first item's id
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleRegister = async () => {
        try {
            await api.post('/register', { email, password, role, country });
            alert('Registration successful');
            navigate('/profile');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create an Account</h2>

                <div className="mb-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                {/* Role Dropdown */}
                <div className="mb-4">
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        {roles.length > 0 ? (
                            roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))
                        ) : (
                            <option>Loading roles...</option>
                        )}
                    </select>
                </div>

                {/* Country Dropdown */}
                <div className="mb-4">
                    <select 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        {countries.length > 0 ? (
                            countries.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        ) : (
                            <option>Loading countries...</option>
                        )}
                    </select>
                </div>

                <button 
                    onClick={handleRegister} 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Register
                </button>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account? 
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-blue-500 hover:underline ml-1"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
