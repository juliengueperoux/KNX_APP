const variable = require('./variables'); 
const connection = require('./connection')


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
exports.connectionKnx = () => {
    connection.connected();
}

exports.deconnectionKnx = () => {
    connection.Disconnect();
}

exports.startLight = (id) => {
    connection.write("0/1/"+id,1); 
}

exports.stopLight = (id) => {
    connection.write("0/1/"+id,0); 
}

exports.startAllLights = () => {
    for(i=0;i<variable.main.arrayLamp.length;i++){
        connection.write(variable.main.arrayLamp[i],1); // allumer
    } 
}

exports.stopAllLights = () => {
    for(i=0;i<variable.main.arrayLamp.length;i++){
        connection.write(variable.main.arrayLamp[i],0); // eteindre
    } 
}

exports.startChase = async () => {
    variable.main.startChain = true;
    while(variable.main.startChain){
      var index = 0;
      for(i=0;i<variable.main.arrayLamp.length;i++){
        index = (!variable.main.sensDirect) ? variable.main.arrayLamp.length-1 - i : i; // si variable.main.sensDirect = true variable.main.sensDirect normal sinon variable.main.sensDirect à l envers!
        connection.write(variable.main.arrayLamp[index],1); // allumer
        await sleep(variable.main.interval);
        connection.write(variable.main.arrayLamp[index],0); // allumer
      } 
    }
}
 
exports.stopChase = () => {
    variable.main.startChain = false;
}

exports.setUpInterval = () => {
    variable.main.interval +=1000;
};

exports.setDownInterval = () => {
    if(variable.main.interval>1000) variable.main.interval -=1000;
};

exports.reverse = () =>{
    if(variable.main.sensDirect) variable.main.sensDirect = false;
          else variable.main.sensDirect = true;
}