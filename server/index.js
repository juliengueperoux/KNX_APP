const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./app/routes');
var knx = require('knx');

//maquettefing1
/*const auth = require('./app/middlewares/auth');
auth.init(passport);*/

app.use(cookieParser())

app.use(morgan('combined'));
app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(express.static('static'));

router(app);

//var db = require('./config/config');
//console.log('dburl : '+db.url)

app.use(passport.initialize())
app.use(passport.session())

http.createServer(app).listen(port, () => {
   console.log('Listening on ' + port);
});


var connection = new knx.Connection( {
  // ip address and port of the KNX router or interface
  ipAddr: '192.168.0.5', port:3671,  // port 22 à essayer 
  physAddr: '1.1',
 
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function(){
      // WRITE an arbitrary boolean request to a DPT1 group address
      connection.write("0/1/1", 1);
      
      connection.write("0/1/3", 1)


    },
    // get notified for all KNX events:
    event: function(evt, src, dest, value) { console.log(
        "event: %s, src: %j, dest: %j, value: %j",
        evt, src, dest, value
      );
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});

exports = module.exports = app;