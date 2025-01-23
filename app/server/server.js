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
import { lookInDbById } from "./utils/db/allDbCalls.js";

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

  console.log(session.passport.user, session.passport);

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
    console.log(myId, " : was the first person to join ", roomName);
    socket.join(roomName);
  });

  socket.on("join-group-video-room", async (data) => {
    try {
      const { myId, groupId, groupName, participantsIds } = data;

      const roomName = `${groupId}-${groupName}-${groupId}-group-video-call-room`;

      console.log(
        myId,
        " : joined the  room : ",
        roomName,
        " and the present particpants are : ",
        participantsIds
      );

      socket.join(roomName);

      const allUsersInVideoCall = await User.findAll({
        where: {
          id: {
            [Op.in]: participantsIds,
          },
        },
      });

      printErrorInGoodWay(allUsersInVideoCall);
      if (!allUsersInVideoCall.length) {
        console.warn(`No users found for participants: ${participantsIds}`);
        return;
      }

      allUsersInVideoCall.forEach((user) => {
        if (user.socketId) {
          io.to(user.socketId).emit("conn-prepare", {
            connUserSocketId: socket.id,
            userId: session.passport.user, // Use `myId` from the event data
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
    printErrorInGoodWay("bro inside conn-singal : ");
    console.log(data);

    const signalingData = {
      signal: signal,
      connUserSocketId: socket.id,
    };
    io.to(connUserSocketId).emit("conn-signal", signalingData);
  });

  socket.on("conn-init", async (data) => {
    printErrorInGoodWay("bro i got data in conn-init : ");
    console.log(data);
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

  socket.on("disconnect", async (reason) => {
    // printErrorInGoodWay("oooooooooo --- conn --- oooooooooo");

    console.log(`User disconnected : ${socket.id} successfully : ${reason}`);
    const groupId = await updateUserSocketService(
      socket,
      session.passport.user,
      false,
      true
    );

    const room = await giveRoomName(socket, groupId);

    // also make sure to notify people in video group if he was present

    // printErrorInGoodWay(room);
    io.to(room).emit("someone-left-room", {
      userId: session.passport.user,
    });
  });
});

/////////////////////////////

app.get("/", (req, res) => {
  res.send("hi");
});

server.listen(3000, () => {
  console.log("server running on port 3000 ...");
});
