import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Quotes = sequelize.define("quotes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quote: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Unknown",
  },
});
