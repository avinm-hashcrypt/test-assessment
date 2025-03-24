import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Country = sequelize.define('Country', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

export default Country;
