import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Jokes = sequelize.define(
  "jokes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    setup: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    delivery: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    joke: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["setup", "delivery"],
      },
    ],
  }
);
