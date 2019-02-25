const knx = require('knx')

var connection = new knx.Connection(
  {
  // ip address and port of the KNX router or interface
  ipAddr: '192.168.0.5', ipPort: 3671,
  // in case you need to specify the multicast interface (say if you have more than one)
  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function() {
      console.log('Hurray, I can talk KNX!');
      // WRITE an arbitrary boolean request to a DPT1 group address
      
      connection.write("0/1/1", 0) 
      connection.write("0/1/2", 0) 
      connection.write("0/1/3", 0) 
      connection.write("0/1/4", 0) 
      connection.write("0/1/2", 1)
      connection.write("0/1/4", 1)
      // you also WRITE to an explicit datapoint type, eg. DPT9.001 is temperature Celcius
      //connection.write("2/1/0", 22.5, "DPT9.001");
      // you can also issue a READ request and pass a callback to capture the response
      //connection.read("1/0/1", (src, responsevalue) => {
//...
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