const KNXConfigModel = require('./models/knxConfig')
const connectionsList = []
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.initConnections=()=>{
   KNXConfigModel.find({}, (err, results) => {
        if (err) return
        else {
            for(config in results){
                const connection = new(require('./connection'))
                connection.ipPort = config.port
                connection.ipAddr = config.ipAddr
                connection._id= config._id
                connection.interval = 1000
                connection.startChain = false,
                connection.arrayLamp = config.lights
                connection.sensDirect = true
                connection.connected().then(()=>{
                    connection.connect = true
                })
                connectionsList.push(connection)
            }
        }
    })
    return true
}


exports.connectionKnx = (idUser,idKnx) => {
    try{
        const connection = getKNXConfig(idKnx)
        connection.connected();
        return true;        
    }
    catch(error) {
        return error;
    }
}

exports.deconnectionKnx = (idKnx) => {
    try{
        const connection = getKNXConfig(idKnx)
        connection.Disconnect();
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.startLight = (id,idKnx) => {
    try{
        const connection = getKNXConfig(idKnx)
        connection.write(id,1);
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.stopLight = (id,idKnx) => {
    try{
        const connection = getKNXConfig(idKnx)
        connection.write(id,0); 
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.startAllLights = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    for(i=0;i<connection.arrayLamp.length;i++){
        try{
            connection.write(connection.arrayLamp[i].id,1); // allumer        
        }
        catch(error) {
            return error;
        }  
    } 
    return true;        
}

exports.stopAllLights = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    try{
        for(i=0;i<connection.arrayLamp.length;i++){
           connection.write(connection.arrayLamp[i],0); // eteindre
        } 
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.startChase = async (idKnx) => {
    const connection = getKNXConfig(idKnx)
    try{
        connection.startChain = true;
        while(connection.startChain){
            var index = 0;
            for(i=0;i<connection.arrayLamp.length;i++){
                index = (!connection.sensDirect) ? connection.arrayLamp.length-1 - i : i; // si connection.sensDirect = true connection.sensDirect normal sinon connection.sensDirect à l envers!
                connection.write(connection.arrayLamp[index],1); // allumer
                await sleep(connection.interval);
                connection.write(connection.arrayLamp[index],0); // allumer
            } 
        }
        return true;        
    }
    catch(error) {
        return error;
    }  
    
}
 
exports.stopChase = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    try{
        connection.startChain = false;
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.setInterval = (interval,idKnx) =>{
    const connection = getKNXConfig(idKnx)
    try{
        console.log("INTERVAL : " + connection.interval);
        (connection.interval >=500) ? connection.interval = interval : connection.interval = 500;
        return true;
    }
    catch(error) {
        return error;
    }
}

exports.setUpInterval = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    try{
        connection.interval +=1000;
        return true;
    }
    catch(error) {
        return error;
    }  
    
};

exports.setDownInterval = (idKnx) => {
    const connection = getKNXConfig(idKnx)
    try{
        if(connection.interval>1000) connection.interval -=1000;
        return true;
    }
    catch(error) {
        return error;
    }  
   
};

exports.reverse = (idKnx) =>{
    const connection = getKNXConfig(idKnx)
    try{
        connection.sensDirect = (connection.sensDirect) ? false :  true;
        return true;
    }
    catch(error) {
        return error;
    }  
    
}

exports.getAllLight = (idKnx) =>{
    const connection = getKNXConfig(idKnx)
    try{
        return {'success' : true, 'data' : connection.arrayLamp};
    }
    catch(error) {
        return error;
    } 
}

exports.addLight = (name,idKnx) =>{
    const connection = getKNXConfig(idKnx)
    try{
        connection.arrayLamp.push(name);
        return true;
    }
    catch(error) {
        return error;
    } 
}

exports.removeLight = (name,idKnx) =>{
    const connection = getKNXConfig(idKnx)
    try{
        let index = connection.arrayLamp.indexOf(name);
        connection.arrayLamp.splice(index, 1);
        return true;
    }
    catch(error) {
        return error;
    } 
}

getKNXConfig = (idConfigKNX)=>{
    connectionsList.find(function(element) {
        return element._id == idConfigKNX;
      });
}