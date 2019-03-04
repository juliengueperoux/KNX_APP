const knx = require('knx')

var interval = 1000;
var startChain = true;

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
      
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
      async function launch() {
        while(startChain){
          if(!startChain) break;
          start(1);
          await sleep(interval);
          end(1);
          start(2);
          await sleep(interval);
          end(2);
          start(3);
          await sleep(interval);
          end(3);
          start(4);
          await sleep(interval);
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
        
      
        
      
      },
  
    // get notified for all KNX events:
    event: function(evt, src, dest, value) { 
    
      if(dest == "0/3/4"){
          console.log("Appui dernier à droite : " + interval);
          interval +=1000;
      }
      else if(dest == "0/3/3" && interval >1000){
        console.log("Appui dernier à droite : " + interval);
        interval -=1000;
      }else if(dest == "0/3/2"){
        startChain = true;
        launch();
      }else if(dest == "0/3/1"){
        console.log("test");
        startChain = false;
      }

    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("** ERROR: %j", connstatus);
    }
  
  }
  });


  // dernier droit 3/4
  // a sa gauche 3/3
  // a sa gauche 3/2
  // dernier gauche 3/1


