import { sequelize } from "../database.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  online: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  groupSelected: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  typingSpeed: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leetCodeUsername: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
