const connectedUsers=[]
const http = require('http');
const io = require("socket.io")(http);
const wsAuth = require('./middlewares/wsAuth');
const app = require('../index')

io.on("connection", socket => {
    // Log whenever a user connects
    console.log("user connected");

    let auth_timeout = setTimeout(function () {
        console.log("timeout lancé")
        socket.disconnect('unauthorized');
    }, 5000);

    socket.on('authenticate', function (data) {
        clearTimeout(auth_timeout);
        wsAuth.authenticate(data, (err, result, option) => {
            if (err) socket.disconnect('unauthorized');
            else {
                socket.emit("authenticated")
                connectedUsers[option] = {
                    "socket": socket.id
                }
            }
        })
    })

     setInterval(()=>{
        socket.emit('hello',"un beau message !")
    },10000)

    // Log whenever a client disconnects from our websocket server
    socket.on("disconnect", function () {
        console.log("user disconnected");
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on("message", message => {
        console.log("Message Received: " + message);
        io.emit("message", {
            type: "new-message",
            text: message
        });
    });
});

// Initialize our websocket server on port 5000
const server = http.createServer(app).listen(3001, () => {
    console.log("WebSocket started on port 3001");
});

io.listen(server);


module.exports = io