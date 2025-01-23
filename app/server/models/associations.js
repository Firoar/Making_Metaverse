import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./User.js";
import { Group } from "./Group.js";
import { Message } from "./Message.js";
import { Maps } from "./Maps.js";
import { printErrorInGoodWay } from "../utils/printErrors.js";
import { InviteCode } from "./InviteCode.js";

export const User_Group = sequelize.define(
  "user_group",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: Group,
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ["PARTICIPANT", "OWNER"],
    },
    charColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Blue",
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "groupId"],
      },
    ],
  }
);

export const defineAssociation = () => {
  // Many-to-Many: Users and Groups
  User.belongsToMany(Group, { through: User_Group, as: "groups" });
  Group.belongsToMany(User, { through: User_Group, as: "users" });

  // One-to-Many: User owns Groups
  User.hasMany(Group, { foreignKey: "ownerId", as: "ownedGroups" });
  Group.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

  // One-to-Many: Group Messages
  Group.hasMany(Message, { foreignKey: "groupId", as: "messages" });
  Message.belongsTo(Group, { foreignKey: "groupId", as: "group" });

  // One-to-Many: User Messages
  User.hasMany(Message, { foreignKey: "fromUserId", as: "messages" });
  Message.belongsTo(User, { foreignKey: "fromUserId", as: "user" });

  // maps has many group, group has one map
  Maps.hasMany(Group, { foreignKey: "mapId", as: "groups" });
  Group.belongsTo(Maps, { foreignKey: "mapId", as: "map" });

  // group has one invite code, invite code has one group
  Group.hasOne(InviteCode, {
    foreignKey: "groupId",
    as: "inviteCode",
    onDelete: "CASCADE",
  });
  InviteCode.belongsTo(Group, { foreignKey: "groupId", as: "group" });
};

export const fillMapTable = async () => {
  const count = await Maps.count();

  if (count == 0) {
    const allMaps = [
      {
        id: 1,
        link: "../assets/mapv3.png",
        name: "college",
      },
    ];

    await Promise.all(
      allMaps.map(async (map) => {
        try {
          await Maps.create({
            link: map.link,
            name: map.name,
          });
        } catch (error) {
          printErrorInGoodWay(error);
        }
      })
    );

    console.log("success filled");
  }
};
