import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import redisClient from '../config/redis';
import axios from 'axios';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body;

    // Validate input fields
    if (!email || !password || !role) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        res.status(400).json({ error: 'Email already exists' });
        return
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully', user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body, "password");
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        res.status(400).json({ error: 'User not found' });
        return
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        res.status(400).json({ error: 'Invalid credentials' });
        return
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, 'secret', { expiresIn: '1h' });

    // If Admin, enforce Single Session Login
    if (user.role === 'Admin') {
        const existingSession = await redisClient.get(`admin-session-${user.id}`);
        if (existingSession) {
            res.status(400).json({ error: 'Admin is already logged in on another device' });
            return
        }
        await redisClient.set(`admin-session-${user.id}`, token, { EX: 3600 });
    }

    res.json({ token, userId: user.id });
};

export const getRolesAndCountries = async (req: Request, res: Response): Promise<void> => {
    try {
        const cachedRoles = await redisClient.get('roles');
        const cachedCountries = await redisClient.get('countries');

        if (cachedRoles && cachedCountries) {
            res.json({ roles: JSON.parse(cachedRoles), countries: JSON.parse(cachedCountries) });
            return
        }

        // Fetch from Common Microservice if not cached
        const [rolesResponse, countriesResponse] = await Promise.all([
            axios.get('http://localhost:4001/api/common/roles'),
            axios.get('http://localhost:4001/api/common/countries')
        ]);

        // Store in Redis
        await redisClient.set('roles', JSON.stringify(rolesResponse.data), { EX: 3600 });
        await redisClient.set('countries', JSON.stringify(countriesResponse.data), { EX: 3600 });

        res.json({ roles: rolesResponse.data, countries: countriesResponse.data });
    } catch (error) {
        console.error('Error fetching roles and countries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const forceLogoutAdmin = async (req: Request, res: Response): Promise<void> => {
    const { adminId } = req.body;

    const session = await redisClient.get(`admin-session-${adminId}`);
    if (!session) {
        res.status(400).json({ error: 'No active session found for this admin' });
        return 
    }

    await redisClient.del(`admin-session-${adminId}`);
    res.json({ message: 'Admin logged out successfully' });
};

export const viewSessions = async (req: Request, res: Response): Promise<void> => {
    try {
        const keys = await redisClient.keys('admin-session-*'); // Get all admin session keys
        const sessions = [];

        for (const key of keys) {
            const token = await redisClient.get(key);
            if (token) {
                sessions.push({ adminId: key.replace('admin-session-', ''), token });
            }
        }

        res.json({ activeSessions: sessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return 
        }

        const filePath = `/uploads/${req.params.userId}/${req.file.filename}`;

        res.status(200).json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
