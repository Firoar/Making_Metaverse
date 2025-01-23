import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./User.js";
import { Maps } from "./Maps.js";

export const Group = sequelize.define("group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mapId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Maps,
      key: "id",
    },
    onDelete: "SET NULL",
  },
});
