import { participantColors } from "../assets/participantColors.js";
import {
  send400ErrorResponse,
  send401ErrorResponse,
  send404ErrorResponse,
  send409ErrorResponse,
  send500ErrorResponse,
} from "../helpers/responseHelpers.js";
import { Group } from "../models/Group.js";
import { InviteCode } from "../models/InviteCode.js";
import { Jokes } from "../models/Jokes.js";
import { Message } from "../models/Message.js";
import { Quotes } from "../models/Quotes.js";
import { User } from "../models/User.js";
import {
  isUserNew,
  isValidMapId,
  lookInDb,
  lookInDbById,
} from "../utils/db/allDbCalls.js";
import { generateRandomCode } from "../utils/generateInvitecodes.js";
import { printErrorInGoodWay } from "../utils/printErrors.js";

export const getIsUserNewContoller = async (req, res) => {
  try {
    const isUserNewhere = await isUserNew(req.user.id);
    return res.status(200).json({
      ok: true,
      isNewUser: isUserNewhere,
    });
  } catch (error) {
    return send500ErrorResponse(error, res);
  }
};

export const isGroupNameNew = async (req, res) => {
  try {
    const { groupName } = req.query;
    // printErrorInGoodWay(req.query);
    if (
      !groupName ||
      typeof groupName !== "string" ||
      groupName.trim() === ""
    ) {
      return res.status(400).json({
        ok: false,
        message: "Group name is required.",
      });
    }

    const user = await lookInDbById(req.user.id);
    if (!user) {
      return send404ErrorResponse(null, res, "User not found");
    }
    const userGroups = await user.getGroups();
    const isGroupExists = userGroups.some((group) => group.name === groupName);

    return res.status(200).json({
      ok: true,
      found: isGroupExists,
    });
  } catch (error) {
    return send500ErrorResponse(error, res);
  }
};

export const createNewGroup = async (req, res) => {
  try {
    const { groupName, mapId, colorChoosed } = req.body;

    if (
      !groupName ||
      typeof groupName !== "string" ||
      groupName.trim() === ""
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid group name.",
      });
    }

    // if u want u can validate mapId, but i am ignoring it, because the user doesnt fill it anyway. the frontend server does it for the user.

    // below is optional.just making sure this is robust
    if (!mapId || typeof mapId !== "number") {
      return res.status(400).json({
        ok: false,
        message: "Invalid map ID.",
      });
    }
    const isValid = await isValidMapId(mapId);
    if (!isValid) {
      return res.status(400).json({
        ok: false,
        message: "Map ID does not exist.",
      });
    }

    const user = await lookInDbById(req.user.id);

    if (!user) {
      return send404ErrorResponse(null, res, "User not found");
    }

    const newGroup = await Group.create(
      {
        name: groupName,
        ownerId: user.id,
        mapId: mapId,
        inviteCode: {
          code: await generateRandomCode(8),
        },
      },
      {
        include: [
          {
            model: InviteCode,
            as: "inviteCode",
          },
        ],
      }
    );

    await newGroup.addUser(user, {
      through: {
        role: "OWNER",
        charColor: colorChoosed,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Successfully created the group",
      groupId: newGroup.id,
      groupName: newGroup.name,
    });
  } catch (error) {
    return send500ErrorResponse(error, res);
  }
};

export const getAllUserGroups = async (req, res) => {
  try {
    const user = await lookInDbById(req.user.id);

    if (!user) {
      return send404ErrorResponse(null, res, "User not found");
    }

    const allUserGroups = await user.getGroups();

    const filtredGroupData = await Promise.all(
      allUserGroups.map(async (group) => {
        const usersOfGrp = await group.getUsers();

        const participants = usersOfGrp
          .filter((u) => u.id !== req.user.id)
          .map((u) => ({
            id: u.id,
            username: u.username,
            color: u.user_group.charColor,
            info: null,
          }));

        // printErrorInGoodWay(participants);

        return {
          id: group.id,
          mapId: group.mapId,
          name: group.name,
          ownerId: group.ownerId,
          isOwner: group.ownerId === req.user.id,
          myCharColor: group.user_group.charColor,
          myId: group.user_group.userId,
          myName: req.user.username,
          participants: participants,
        };
      })
    );

    return res.status(200).json({
      ok: true,
      allUserGroups: filtredGroupData,
    });
  } catch (error) {
    return send500ErrorResponse(error, res);
  }
};

export const getGroupInviteCode = async (req, res) => {
  const { groupId } = req.query;

  if (!groupId) {
    send400ErrorResponse(null, res, "Group Id required");
  }

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      send404ErrorResponse(null, res, "Group not found");
    }

    const inviteCode = await group.getInviteCode();

    // printErrorInGoodWay(inviteCode);

    if (!inviteCode) {
      send500ErrorResponse(
        null,
        res,
        "Server Error : invite code is not initialised"
      );
    }

    const updatedTime = new Date(inviteCode.updatedAt);
    const currentTime = new Date();

    const hoursDiff = (currentTime - updatedTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      inviteCode.code = generateRandomCode(8);
      inviteCode.save();

      return res.status(200).json({
        ok: true,
        code: inviteCode.code,
      });
    } else {
      return res.status(200).json({
        ok: true,
        code: inviteCode.code,
      });
    }
  } catch (error) {
    return send500ErrorResponse(
      error,
      res,
      "Server Error : while geting  invite code"
    );
  }
};

export const joinGroup = async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return send400ErrorResponse(null, res, "Invite Code required");
  }

  try {
    const user = await lookInDbById(req.user.id);

    if (!user) {
      return send401ErrorResponse(null, res, "Unauthorized");
    }

    const ic = await InviteCode.findOne({
      where: {
        code: inviteCode,
      },
    });

    if (!ic) {
      return send404ErrorResponse(null, res, "Invalid Invite Code");
    }

    const requestedGroup = await ic.getGroup();

    if (!requestedGroup) {
      return send404ErrorResponse(
        null,
        res,
        "Group not found for this invite code"
      );
    }

    const existingUsers = await requestedGroup.getUsers();

    // find if user is present all also all colors used by other users of group
    const isUserPresent = existingUsers.some((u) => u.id === user.id);

    if (isUserPresent) {
      return send400ErrorResponse(null, res, "user already in group");
    }

    if (existingUsers.length == 10) {
      return send409ErrorResponse(
        null,
        res,
        "Group already has maximum number od members and cannot accept more participants."
      );
    }

    const usedColors = existingUsers.map((existingUser) => {
      const userGroup = existingUser.user_group; // Access the join table instance

      printErrorInGoodWay(userGroup);
      return userGroup?.charColor;
    });

    const availableColors = participantColors.filter(
      (color) => !usedColors.includes(color)
    );

    const assignedColor =
      availableColors[Math.floor(Math.random() * availableColors.length)]; // Fallback to default if none are available

    await requestedGroup.addUser(user, {
      through: {
        role: "PARTICIPANT",
        charColor: assignedColor,
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Successfully joined the group",
    });
  } catch (error) {
    return send500ErrorResponse(
      error,
      res,
      "An error occurred while trying to join the group"
    );
  }
};

export const getGroupChats = async (req, res) => {
  const { groupId, groupName } = req.query;

  if (!groupId || !groupName) {
    return send400ErrorResponse(
      null,
      res,
      "Group Id  and Group Name is required"
    );
  }

  const group = await Group.findOne({
    where: {
      id: groupId,
      name: groupName,
    },
  });

  if (!group) {
    return send404ErrorResponse(null, res, "No such group exists");
  }

  const messages = await group.getMessages({
    order: [["createdAt", "ASC"]],
  });
  // printErrorInGoodWay(messages);

  const filteredMessages = messages.map((msg) => {
    return {
      id: msg.id,
      groupId: msg.groupId,
      userId: msg.fromUserId,
      content: msg.content,
    };
  });

  return res.status(200).json({
    ok: true,
    chats: filteredMessages,
  });
};

export const sendChatToGroup = async (req, res) => {
  const { groupId, userId, chat } = req.body;
  if (!groupId || !userId || !chat) {
    return send400ErrorResponse(null, res, "Need groupId,userId and chat");
  }
  try {
    const message = await Message.create({
      groupId: groupId,
      fromUserId: userId,
      content: chat,
    });

    const filteredMessage = {
      id: message.id,
      groupId: message.groupId,
      userId: message.fromUserId,
      content: message.content,
    };

    return res.status(201).json({
      ok: true,
      chat: filteredMessage,
    });
  } catch (error) {
    return send500ErrorResponse(error, null, "error sending chat to group");
  }
};

export const getIdToNameAndColor = async (req, res) => {
  const { groupId } = req.query;

  if (!groupId) {
    return send400ErrorResponse(null, res, "Group Id is not defined.");
  }

  const group = await Group.findByPk(groupId);

  if (!group) {
    return send404ErrorResponse(null, res, "Group not found.");
  }

  const usersOfGrp = await group.getUsers();

  const participants = usersOfGrp
    .filter((u) => u.id !== req.user.id)
    .map((u) => ({
      id: u.id,
      username: u.username,
      color: u.user_group.charColor,
      info: null,
    }));

  return res.status(200).json({
    ok: true,
    participants: participants,
  });
};

export const getTodaysQuote = async (req, res) => {
  try {
    const { id } = req.query;

    const quote = await Quotes.findByPk(id);

    if (!quote) {
      return send404ErrorResponse(null, res, "Did not find today's quote.");
    }

    return res.status(200).json({
      ok: true,
      quote: quote.quote,
      author: quote.author,
    });
  } catch (error) {
    return send500ErrorResponse(error, res, "Error getting today's quote!!!!!");
  }
};

export const getTodaysJoke = async (req, res) => {
  try {
    const { id } = req.query;
    printErrorInGoodWay("id : " + id);
    const joke = await Jokes.findByPk(id);

    if (!joke) {
      return send404ErrorResponse(null, res, "Did not find today's joke");
    }

    return res.status(200).json({
      ok: true,
      fullJoke: {
        joke: joke.joke,
        setup: joke.setup,
        delivery: joke.delivery,
      },
    });
  } catch (error) {}
};
