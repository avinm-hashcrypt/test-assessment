import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

export default Role;
