import express from 'express';
import cors from 'cors';
import commonRoutes from './routes/commonRoutes';
import sequelize from './config/database';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/common', commonRoutes);

sequelize.sync().then(() => console.log('Database connected'));
app.listen(4001, () => console.log('Common Service running on port 4001'));
