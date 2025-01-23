import { sequelize } from "../database.js";
import { DataTypes } from "sequelize";
import { Group } from "./Group.js";

export const InviteCode = sequelize.define("invite_code", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group, // The model name should match the table name
      key: "id",
    },
    onDelete: "CASCADE",
  },
});
