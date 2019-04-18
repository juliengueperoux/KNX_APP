const knx = require('knx');
let ipAddress = '192.168.0.5'
let ipPort = 3671

const io = require('./webSocket')

const connection = new knx.Connection({
  // ip address and port of the KNX router or interface
  ipAddr: ipAddress,
  ipPort: ipPort,
  // in case you need to specify the multicast interface (say if you have more than one)
  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function () {
      console.log('Connecté');
      this.connect = true
    },

    // get notified for all KNX events:
    event: function (evt, src, dest, value) {
      // cette commande permet d'envoyer un message à toutes les sockets
      io.sockets.emit(dest)

      if (dest == "0/3/4") {
        console.log("Appui dernier à droite : " + this.interval);
        this.interval += 1000;
      } else if (dest == "0/3/3" && this.interval > 1000) {
        console.log("Appui dernier à droite : " + this.interval);
        this.interval -= 1000;
      } else if (dest == "0/3/2") {
        if (startChain) {
          startChain = false;
        } else {
          startChain = true;
          //launch();
        }
      } else if (dest == "0/3/1") {
        if (this.sensDirect) this.sensDirect = false;
        else this.sensDirect = true;
      }

    },
    // get notified on connection errors
    error: function (connstatus) {
      console.log("** ERROR: %j", connstatus);
    }
  }
});

module.exports = connection

// dernier droit 3/4
// a sa gauche 3/3
// a sa gauche 3/2
// dernier gauche 3/1