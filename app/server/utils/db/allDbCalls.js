import { Maps } from "../../models/Maps.js";
import { User } from "../../models/User.js";
import { Op } from "sequelize";
import { printErrorInGoodWay } from "../printErrors.js";
import { Group } from "../../models/Group.js";

export const lookInDb = async (email, username) => {
  const conditions = [];
  if (email) {
    conditions.push({ email });
  }
  if (username) {
    conditions.push({ username });
  }

  if (conditions.length === 0) {
    throw new Error("At least one of email or username must be provided");
  }
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: conditions,
      },
    });

    return user || null;
  } catch (error) {
    throw error;
  }
};

export const lookInDbById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user || null;
  } catch (error) {
    throw error;
  }
};

export const isValidMapId = async (mapId) => {
  try {
    const map = await Maps.findByPk(mapId);
    if (!map) {
      throw new Error("Invalid map Id");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const isUserNew = async (id) => {
  try {
    const user = await lookInDbById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // const allGroups = await user.getGroups();

    const participantGroupsCount = await user.countGroups({
      where: { "$user_group.role$": "PARTICIPANT" },
    });
    const ownerGroupsCount = await user.countGroups({
      where: { "$user_group.role$": "OWNER" },
    });

    // printErrorInGoodWay(allGroups);
    // printErrorInGoodWay(participantGroupsCount);
    // printErrorInGoodWay(ownerGroupsCount);

    const totalGroupsCount = participantGroupsCount + ownerGroupsCount;
    return totalGroupsCount === 0;
  } catch (error) {
    throw error;
  }
};

export const updateUserSocketId = async (
  id,
  isOnline,
  socketId = null,
  leaving
) => {
  try {
    let room;
    const user = await lookInDbById(id);
    if (!user) {
      throw new Error("User not found => userSocketId");
    }
    user.socketId = socketId;
    user.online = isOnline;

    if (leaving) {
      room = user.groupSelected;
      user.groupSelected = null;
    }
    await user.save();

    return room;
  } catch (error) {
    throw error;
  }
};

export const updateUserSelectedGroup = async (groupId, userId) => {
  try {
    const user = await lookInDbById(userId);
    if (!user) {
      throw new Error("User not found => userSelectedGroup");
    }
    user.groupSelected = groupId;
    await user.save();
  } catch (error) {
    throw error;
  }
};

export const giveGroupName = async (groupId) => {
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new Error(`No such group exist :  ${groupId}`);
    }
    return group.name;
  } catch (error) {
    throw error;
  }
};
