import express from "express";
import { syncTheDb } from "./utils/syncDB.js";
import { Server } from "socket.io";
import http from "http";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protected.js";
import appRouter from "./routes/app.js";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import "./strategies/local-strategy.js";
import {
  giveRoomName,
  updatedSelectedGroup,
  updateUserSocketService,
} from "./services/socket.js";
import { printErrorInGoodWay } from "./utils/printErrors.js";
import { User } from "./models/User.js";
import { Op } from "sequelize";
import { giveMePeerRoomName, lookInDbById } from "./utils/db/allDbCalls.js";
import { incomingRequest } from "./middleware/middleware.js";

await syncTheDb();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const sessionMiddleware = session({
  secret: "jaiSriRam-jaiSriKrishna",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(incomingRequest);

// router
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);
app.use("/api", appRouter);

// socket server
const io = new Server(server, {
  cors: corsOptions,
});

// socket middleware
io.engine.use(sessionMiddleware);

// socket routes
io.on("connection", async (socket) => {
  const session = socket.request.session;

  if (!session && !session.passport && !session.passport.user) {
    console.log(`Unauthorized socket connection attempt: ${socket.id}`);
    socket.disconnect();
    return;
  }

  console.log(`User connected : ${socket.id}`);
  await updateUserSocketService(socket, session.passport.user, true);

  socket.on("clicked-group", async (data) => {
    await updatedSelectedGroup(socket, data.groupId, session.passport.user);
  });

  socket.on("i-moved", async (data) => {
    const roomName = `${data.groupId}-${data.groupName}-${data.groupId}`;
    const dataTosend = {
      groupId: data.groupId,
      myId: session.passport.user,
      posX: data.posX,
      posY: data.posY,
    };

    socket.to(roomName).emit("someone-moved", dataTosend);
  });

  socket.on("i-sent-message", (data) => {
    const roomName = `${data.groupId}-${data.groupName}-${data.groupId}`;
    io.to(roomName).emit("someone-sent-message");
  });

  socket.on("join-group", async (data) => {
    // leave all the rooms first
    const roomsJoinedBefore = Array.from(socket.rooms);
    roomsJoinedBefore.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }

      // notify those in that group that u left
      socket.to(room).emit("someone-left-room", {
        userId: session.passport.user,
      });
    });

    // now join the room
    const roomName = `${data.groupId}-${data.groupName}-${data.groupId}`;
    socket.join(roomName);

    io.to(roomName).emit("someone-joined", {
      id: session.passport.user,
      roomName: roomName,
    });
  });

  socket.on("take-my-coordinates", (data) => {
    socket.to(data.roomName).emit("someone-sent-their-coordinates", {
      data: data.myInfo,
    });
  });

  socket.on("i-joined-new-group", () => {
    socket.emit("i-joined-new-group");
  });

  socket.on("leaving-room", () => {
    const roomsJoinedBefore = Array.from(socket.rooms);
    roomsJoinedBefore.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }

      // notify those in that group that u left
      socket.to(room).emit("someone-left-room", {
        userId: session.passport.user,
      });
    });
  });

  socket.on("create-group-video-room", (data) => {
    const { myId, groupId, groupName } = data;

    const roomName = `${groupId}-${groupName}-${groupId}-group-video-call-room`;
    socket.join(roomName);
  });

  socket.on("join-group-video-room", async (data) => {
    try {
      const { myId, groupId, groupName, participantsIds } = data;

      const roomName = `${groupId}-${groupName}-${groupId}-group-video-call-room`;

      socket.join(roomName);

      const allUsersInVideoCall = await User.findAll({
        where: {
          id: {
            [Op.in]: participantsIds,
          },
        },
      });

      if (!allUsersInVideoCall.length) {
        console.warn(`No users found for participants: ${participantsIds}`);
        return;
      }

      allUsersInVideoCall.forEach((user) => {
        if (user.socketId) {
          io.to(user.socketId).emit("conn-prepare", {
            connUserSocketId: socket.id,
            userId: session.passport.user,
          });
        } else {
          console.error(`User ${user.id} has no valid socketId`);
        }
      });
    } catch (error) {
      printErrorInGoodWay("Error handling join-user : " + error);
    }
  });

  socket.on("conn-signal", (data) => {
    const { connUserSocketId, signal } = data;

    const signalingData = {
      signal: signal,
      connUserSocketId: socket.id,
    };
    io.to(connUserSocketId).emit("conn-signal", signalingData);
  });

  socket.on("conn-init", async (data) => {
    try {
      const { connUserSocketId } = data;

      io.to(connUserSocketId).emit("conn-init", {
        connUserSocketId: socket.id,
        userId: session.passport.user,
      });
    } catch (error) {
      printErrorInGoodWay("bro error in conn-init");
      printErrorInGoodWay(error);
    }
  });

  socket.on("i-left-group-video-chat", (data) => {
    const { groupId, groupName } = data;
    const roomName = `${groupId}-${groupName}-${groupId}-group-video-call-room`;
    socket.leave(roomName);

    io.to(roomName).emit("someone-left-group-video-chat", {
      socketId: socket.id,
      userId: session.passport.user,
    });
  });

  socket.on("create-peer-video-room", (data) => {
    const { groupId, groupName, userId, tableId } = data;
    socket.join(giveMePeerRoomName(groupId, groupName, tableId));
  });
  socket.on("join-peer-video-room", (data) => {
    const { groupId, groupName, userId, tableId } = data;

    const roomName = giveMePeerRoomName(groupId, groupName, tableId);
    socket.join(roomName);

    socket.to(roomName).emit("peer-conn-prepare", {
      peerRoomSocketId: roomName,
      peerUserId: session.passport.user,
    });
  });

  socket.on("peer-conn-init", (data) => {
    const { peerRoomSocketId } = data;
    socket.to(peerRoomSocketId).emit("peer-conn-init", {
      peerRoomSocketId: peerRoomSocketId,
      peerUserId: session.passport.user,
    });
  });

  socket.on("peer-conn-signal", (data) => {
    socket
      .to(data.peerRoomSocketId)
      .emit("peer-conn-signal", { signal: data.signal });
  });

  socket.on("i-ended-peer-call", (data) => {
    const { groupId, groupName, userId, tableId } = data;
    socket
      .to(giveMePeerRoomName(groupId, groupName, tableId))
      .emit("someone-left-peer-call", {
        userId: session.passport.user,
      });
  });

  socket.on("disconnect", async (reason) => {
    console.log(`User disconnected : ${socket.id} successfully : ${reason}`);
    const groupId = await updateUserSocketService(
      socket,
      session.passport.user,
      false,
      true
    );

    if (groupId) {
      const room = await giveRoomName(socket, groupId);

      io.to(room).emit("someone-left-room", {
        userId: session.passport.user,
        socketId: socket.id,
      });
    }
  });
});

/////////////////////////////

app.get("/", (req, res) => {
  res.send("hi");
});

server.listen(3000, () => {
  console.log("server running on port 3000 ...");
});
