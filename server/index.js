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


var connection = new knx.Connection( {
    // ip address and port of the KNX router or interface
    ipAddr: '192.168.0.5', ipPort: 3671, // port 22 à essayer 
    // in case you need to specify the multicast interface (say if you have more than one)
    interface: 'eth0',
    // the KNX physical address we'd like to use
    physAddr: '1.1',
    // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
    loglevel: 'info',
    // do not automatically connect, but use connection.Connect() to establish connection
    manualConnect: true,  
    // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
    forceTunneling: true,
    // wait at least 10 millisec between each datagram
    minimumDelay: 10,
    // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
    suppress_ack_ldatareq: false,
    // define your event handlers here:
    handlers: {
      // wait for connection establishment before sending anything!
      connected: function(){
        console.log('Hurray, I can talk KNX!');
        // WRITE an arbitrary boolean request to a DPT1 group address
       // connection.write("1/0/0", 1);
        // you also WRITE to an explicit datapoint type, eg. DPT9.001 is temperature Celcius
       // connection.write("2/1/0", 22.5, "DPT9.001");
        // you can also issue a READ request and pass a callback to capture the response
       // connection.read("1/0/1", (src, responsevalue) => { ... });
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

exports = module.exports = app;