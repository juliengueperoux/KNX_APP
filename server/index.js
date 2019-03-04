/*const express = require('express');
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
auth.init(passport);

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
*/

const knx = require('knx');

var connection = new knx.Connection(
  {
  // ip address and port of the KNX router or interface
  ipAddr: '192.168.0.6', ipPort: 3671,
  physAddr: '1.1',
  // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
  loglevel: 'info',
  // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
  forceTunneling: true,
  // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
  suppress_ack_ldatareq: false,


  handlers: {
    // wait for connection establishment before sending anything!
    connected: function() {
      console.log('Connecté');
  
    /* function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
      async function launch() {
        while(true){
          start(1);
          await sleep(1000);
          end(1);
          start(2);
          await sleep(1000);
          end(2);
          start(3);
          await sleep(1000);
          end(3);
          start(4);
          await sleep(1000);
          end(4);
        }
      }
      
      launch();

   
      function end(nb){
        var par = "0/1/"+ nb;
        console.log("END : " + par);
        connection.write(par, 0) 
      }

      function start(nb){
        var par = "0/1/"+ nb;
        console.log("START : " + par);
        connection.write(par, 1) 
      }
       
      */
      }
    },
    // get notified for all KNX events:
    event: function(evt, src, dest, value) { console.log(
        "event: %s, src: %j, dest: %j, value: %j",
        evt, src, dest, value
      );
    },
   
    // get notified on connection errors
    error: function(connstatus) {
      console.log("** ERROR: %j", connstatus);
    }
  });


//exports = module.exports = app;