var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUsers = [];

io.on("connection", function (socket) {
  console.log("User connecting " + socket.id);

  socket.on("client-send-Username", function (data) {
    if (mangUsers.indexOf(data) >= 0) {
      socket.emit("server-send-dki-thatbai");
    } else {
      mangUsers.push(data);
      socket.Username = data;
      socket.emit("server-send-dki-thanhcong", data);
      io.sockets.emit("server-send-danhsach-Users", mangUsers);
    }
  });

  socket.on("logout", function () {
    mangUsers.splice(
      mangUsers.indexOf(socket.Username), 1
    );
    socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
  });

  socket.on("user-send-message", function (data) {
    io.sockets.emit("server-send-mesage", { un: socket.Username, nd: data });
  });

  socket.on("typing", function () {
    const s = socket.Username + " typing";
    io.sockets.emit("some one typing", s);
  });

  socket.on("stop typing", function () {
    io.sockets.emit("some one stop typing");
  });


});

app.get("/", (req, res) => {
  res.render("trangchu");
});
