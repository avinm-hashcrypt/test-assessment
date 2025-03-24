import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize(
    process.env.DB_NAME as string,   // Database Name
    process.env.DB_USER as string,   // Database User
    process.env.DB_PASSWORD as string,  // Database Password
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set true for debugging queries
    }
);

export default sequelize;
