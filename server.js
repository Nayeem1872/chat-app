const express = require("express");
const path = require("path");
require("dotenv").config(); // Import and configure dotenv

const app = express();
const PORT = process.env.PORT || 4000; // Use PORT from .env or fallback to 4000

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

const io = require("socket.io")(server);
let socketsConnected = new Set();

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
