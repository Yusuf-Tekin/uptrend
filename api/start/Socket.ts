import { Ioc } from "@adonisjs/core/build/standalone";
import Message from "App/Models/Message";
import User from "App/Models/User";
import UserTeam from "App/Models/UserTeam";
import Ws from "App/Services/Ws";
Ws.boot();

const onlineUsers: any[] = [];

Ws.io.on("connection", (socket) => {
  socket.join("notifications");

  socket.on("my other event", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("DİSCONNECT");
  });

  socket.on("join-chat-room", async ({ teamId }) => {
    socket.join(`chat-team-${teamId}`);
  });

  socket.on("leave-chat-room", async ({ id }) => {
    const findUser = await User.findBy("id", id);

    socket.leave("chat");
    socket.to("chat").emit("user-disconnect", findUser);
  });

  socket.on("is-online-user", ({ userId }) => {
    const findOnlineUser = onlineUsers.find((user) => user.id === userId);

    if (findOnlineUser) {
      socket.emit("user-online", {
        userId,
        online: true,
      });
    } else {
      socket.emit("user-offline", {
        userId,
        online: false,
      });
    }
  });

  socket.on("send-message", async (data) => {


    const { teamId, message, userId } = data;

    


    const findUserTeam = await UserTeam.query().where({
      userId,
      teamId,
      isConfirmed: true,
    }).first();

    if (findUserTeam) {
      const createdMessage = await Message.create({
        team_id: teamId,
        author_id: userId,
        message,
      });
      await createdMessage.load('user')
      Ws.io.in(`chat-team-${teamId}`).emit('new-message',{
        message:createdMessage
      });
    }
  });
});
