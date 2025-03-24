import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define User attributes
interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: string;
    profilePicture?: string;
}

// Optional fields during creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend Model with typed attributes
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: string;
    public profilePicture?: string;
}

User.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        profilePicture: { type: DataTypes.STRING },
    },
    { sequelize, modelName: 'User', timestamps: false }
);

export default User;
