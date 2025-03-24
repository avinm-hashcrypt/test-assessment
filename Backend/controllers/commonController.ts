import { Request, Response } from 'express';
import Role from '../models/Role';
import Country from '../models/Country';
import redisClient from '../config/redis';

/**
 * Log API Communication Details in Redis
 */
const logApiRequest = async (service: string, endpoint: string, method: string, status: number) => {
    const logEntry = {
        service,
        endpoint,
        method,
        status,
        timestamp: new Date().toISOString(),
    };

    // Push log to Redis list
    await redisClient.lPush('api_logs', JSON.stringify(logEntry));
};

export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const cacheRoles = await redisClient.get('roles');

        console.log(cacheRoles, "cacheroles");
        
        if (cacheRoles) {
            res.json(JSON.parse(cacheRoles));
            return;
        }

        const roles = await Role.findAll();
        await redisClient.set('roles', JSON.stringify(roles), { EX: 3600 });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching roles' });
    }
};

export const getCountries = async (req: Request, res: Response): Promise<void> => {
    try {
        const cacheCountries = await redisClient.get('countries');
        if (cacheCountries) {
            res.json(JSON.parse(cacheCountries));
            return;
        }

        const countries = await Country.findAll();
        await redisClient.set('countries', JSON.stringify(countries), { EX: 3600 });
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching countries' });
    }
};

/**
 * Get Roles and log request
 */
export const getRolesWithLogging = async (req: Request, res: Response) => {
    try {
        const roles = await getRoles(req, res);
        await logApiRequest('User Microservice', '/api/common/roles', 'GET', res.statusCode);
        return roles;
    } catch (error) {
        console.error('Error fetching roles:', error);
        await logApiRequest('User Microservice', '/api/common/roles', 'GET', 500);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Get Countries and log request
 */
export const getCountriesWithLogging = async (req: Request, res: Response) => {
    try {
        const countries = await getCountries(req, res);
        await logApiRequest('User Microservice', '/api/common/countries', 'GET', res.statusCode);
        return countries;
    } catch (error) {
        console.error('Error fetching countries:', error);
        await logApiRequest('User Microservice', '/api/common/countries', 'GET', 500);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * API to Fetch Logs from Redis
 */
export const getApiLogs = async (req: Request, res: Response) => {
    try {
        const logs = await redisClient.lRange('api_logs', 0, -1); // Get all logs
        res.json(logs.map(log => JSON.parse(log)));
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};