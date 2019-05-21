const knx = require('knx');
const functions = require('./functions');
const io = require('./webSocket')

function newConnection(){

  return {
  // ip address and port of the KNX router or interface
  ipAddr: "",
  ipPort: "",
  manualConnect: true,
  // in case you need to specify the multicast interface (say if you have more than one)
  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function () {
      console.log('Connecté');
      functions.sendSocketConnect(this._id)
      
    },

  
    event: function (evt, src, dest, value) {
      console.log("evt:"+evt+",src:"+src+",dest:"+dest+",value:"+JSON.parse(JSON.stringify(value)))
      const state = JSON.parse(JSON.stringify(value)).data[0];

      if(dest.substring(0,3) == "0/2"){
        let idLamp = "0/1/" + dest.substring(4)
        data = {
          'idKnx' : this._id,
          'action' : {
              'value' : state,
              'idLamp' : idLamp
          }    
        }  
        io.sockets.emit('data',JSON.stringify(data))
      }
      if (dest == "0/3/4") {
        if (this.startAllLights) {
          this.startAllLights = false;
          functions.startAllLights(this._id);
        } else {
          functions.stopAllLights(this._id);
          this.startAllLights = true;
        }
        this.interval += 1000;
      } else if (dest == "0/3/3") {
        if(!this.startChain) {
          this.startChain = true;
          functions.startChase(this._id);
        } else {
          functions.stopChase(this._id);
          this.startChain = false;
        }
      } else if (dest == "0/3/2") {
        if(this.startChain) functions.setUpInterval(this._id)
      } else if (dest == "0/3/1") {
        if(this.startChain) functions.setDownInterval(this._id)
      }

    },
    // get notified on connection errors
    error: function (connstatus) {
      console.log("** ERROR: %j", connstatus);
    }
  }
}
}
module.exports = newConnection

// dernier droit 3/4
// a sa gauche 3/3
// a sa gauche 3/2
// dernier gauche 3/1