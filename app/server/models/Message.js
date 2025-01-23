import { sequelize } from "../database.js";
import { DataTypes } from "sequelize";

export const Message = sequelize.define("message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
