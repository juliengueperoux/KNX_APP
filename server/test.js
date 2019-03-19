const knx = require('knx')

var interval = 1000;
var startChain = true;
var arrayLamp = ["0/1/1","0/1/2","0/1/3","0/1/4"]
var sensDirect = true;

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
          var index = 0;
          for(i=0;i<arrayLamp.length;i++){
            index = (!sensDirect) ? arrayLamp.length-1 - i : i; // si sensDirect = true sensDirect normal sinon sensDirect à l envers!
            connection.write(arrayLamp[index],1); // allumer
            await sleep(interval);
            connection.write(arrayLamp[index],0); // allumer
          } 
        }
      }
      launch();

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
        if(startChain){
          startChain = false;
        }else{
          startChain = true;
          //launch();
        }
      }else if(dest == "0/3/1"){
        console.log("ICI");
        if(sensDirect) sensDirect = false;
        else sensDirect = true;
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


