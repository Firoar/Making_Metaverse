import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("my-db", "user", "pass", {
  dialect: "sqlite",
  logging: false,
  host: "./db.sqlite",
  logging: false,
});
