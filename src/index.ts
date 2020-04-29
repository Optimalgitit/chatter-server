import * as cors from "cors";
import * as http from "http";
import * as express from "express";
import * as router from "./router";
import * as socketio from "socket.io";
import { addUser, remUser, getUser, getUsRm } from "./users";


const app = express();
const server = http.createServer(app);

const io = socketio(server);

const PORT = process.env.PORT || 5000;

app.use(router);
app.use(cors())

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    // console.log(`New connection from ${name} (${socket.id}) at ${room}`);
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "WAREbot",
      text: `${user.name}, welcome to the room!`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "WAREbot", text: `${user.name} joined` });

    socket.join(user.room);
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user, text: message });

    // console.log(`New message from ${user.name} (${user.id}) at ${user.room} - ${message}`)

    callback();
  });

  socket.on("disconnect", (socket) => {
    const user = remUser(socket.id);

    if (user) {
      io.to((user as { id: string; name: string; room: string }).room).emit(
        "message",
        {
          user: "admin",
          text: `${
            (user as { id: string; name: string; room: string }).name
          } left`,
        }
      );
    }
  });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
