var knx = require('knx');
var variable = require('./variables'); 

var connection = new knx.Connection(
    {
    // ip address and port of the KNX router or interface
    ipAddr: '192.168.0.6', ipPort: 3671,
    // in case you need to specify the multicast interface (say if you have more than one)
    // define your event handlers here:
    handlers: {  
      // wait for connection establishment before sending anything!
      connected: function() {
        console.log('Connecté');
        },
    
      // get notified for all KNX events:
      event: function(evt, src, dest, value) { 
      
        if(dest == "0/3/4"){
            console.log("Appui dernier à droite : " + variable.main.interval);
            variable.main.interval +=1000;
        }
        else if(dest == "0/3/3" && variable.main.interval >1000){
          console.log("Appui dernier à droite : " + variable.main.interval);
          variable.main.interval -=1000;
        }else if(dest == "0/3/2"){
          if(startChain){
            startChain = false;
          }else{
            startChain = true;
            //launch();
          }
        }else if(dest == "0/3/1"){
          if(variable.main.sensDirect) variable.main.sensDirect = false;
          else variable.main.sensDirect = true;
        }
  
      },
      // get notified on connection errors
      error: function(connstatus) {
        console.log("** ERROR: %j", connstatus);
      }
    
    }
    });

    module.exports = connection;

// dernier droit 3/4
// a sa gauche 3/3
// a sa gauche 3/2
// dernier gauche 3/1
      