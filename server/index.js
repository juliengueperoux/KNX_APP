const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./app/routes');
const mongoose = require('mongoose');
const auth = require('./app/middlewares/auth');
const io = require("socket.io")(http);
const wsAuth = require('./app/middlewares/wsAuth');

const connectedUsers=[]
//maquettefing1

app.use(cookieParser())

app.use(morgan('combined'));
app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(express.static('static'));

router(app,auth);

let db = require('./config/config');
console.log('dburl : '+db.url)
mongoose.connect(db.url,{ useNewUrlParser: true }); 

mongoose.connection.on('connected', () => {
   console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
   console.log('MongoDB connection error : ' + err);
});

mongoose.connection.on('disconnected', () => {
   console.log('MongoDB connection close')
});

http.createServer(app).listen(port, () => {
   console.log('Listening on ' + port);
});

io.on("connection", socket => {
   // Log whenever a user connects
   console.log("user connected");
  
   let auth_timeout = setTimeout(function () {
     console.log("timeout lancé")
    socket.disconnect('unauthorized');
  }, 5000);

  socket.on('authenticate', function (data) {
    clearTimeout(auth_timeout);
    wsAuth.authenticate(data,(err,result,option)=>{
      if(err) socket.disconnect('unauthorized');
      else{
        socket.emit("authenticated")
        connectedUsers[option]={
          "socket" : socket.id
        }
      }
    })
  })

   // Log whenever a client disconnects from our websocket server
   socket.on("disconnect", function() {
     console.log("user disconnected");
   });
 
   // When we receive a 'message' event from our client, print out
   // the contents of that message and then echo it back to our client
   // using `io.emit()`
   socket.on("message", message => {
     console.log("Message Received: " + message);
     io.emit("message", { type: "new-message", text: message });
   });
 });
 
 // Initialize our websocket server on port 5000
 const server = http.createServer(app).listen(3001, () => {
   console.log("WebSocket started on port 3001");
 });

 io.listen(server);

module.exports.app = app
module.exports.io = io
module.exports.connectedUsers = connectedUsers
exports = module.exports
