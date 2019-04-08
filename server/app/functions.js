const variable = require('./variables'); 
const connection = require('./connection')
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
exports.connectionKnx = (idUser) => {
    try{
        connection.connection.connected();
        return true;        
    }
    catch(error) {
        return error;
    }
}

exports.deconnectionKnx = () => {
    try{
        connection.connection.Disconnect();
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.startLight = (id) => {
    try{
        connection.connection.write(id,1);
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.stopLight = (id) => {
    try{
        connection.connection.write(id,0); 
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.startAllLights = () => {


    for(i=0;i<variable.main.arrayLamp.length;i++){
        try{
            connection.write(variable.main.arrayLamp[i].id,1); // allumer        
        }
        catch(error) {
            return error;
        }  
    } 
    return true;        
}

exports.stopAllLights = () => {
    try{
        for(i=0;i<variable.main.arrayLamp.length;i++){
           connection.connection.write(variable.main.arrayLamp[i],0); // eteindre
        } 
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.startChase = async () => {
    try{
        variable.main.startChain = true;
        while(variable.main.startChain){
            var index = 0;
            for(i=0;i<variable.main.arrayLamp.length;i++){
                index = (!variable.main.sensDirect) ? variable.main.arrayLamp.length-1 - i : i; // si variable.main.sensDirect = true variable.main.sensDirect normal sinon variable.main.sensDirect à l envers!
                connection.connection.write(variable.main.arrayLamp[index],1); // allumer
                await sleep(variable.main.interval);
                connection.connection.write(variable.main.arrayLamp[index],0); // allumer
            } 
        }
        return true;        
    }
    catch(error) {
        return error;
    }  
    
}
 
exports.stopChase = () => {
    try{
        variable.main.startChain = false;
        return true;        
    }
    catch(error) {
        return error;
    }  
}

exports.setInterval = (interval) =>{
    try{
        console.log("INTERVAL : " + variable.main.interval);
        (interval >=500) ? variable.main.interval = interval : variable.main.interval = 500;
        return true;
    }
    catch(error) {
        return error;
    }
}

exports.setUpInterval = () => {
    try{
        variable.main.interval +=1000;
        return true;
    }
    catch(error) {
        return error;
    }  
    
};

exports.setDownInterval = () => {
    try{
        if(variable.main.interval>1000) variable.main.interval -=1000;
        return true;
    }
    catch(error) {
        return error;
    }  
   
};

exports.reverse = () =>{
    try{
        variable.main.sensDirect = (variable.main.sensDirect) ? false :  true;
        return true;
    }
    catch(error) {
        return error;
    }  
    
}

exports.getAllLight = () =>{
    try{
        return {'success' : true, 'data' : variable.main.arrayLamp};
    }
    catch(error) {
        return error;
    } 
}

exports.addLight = (name) =>{
    try{
        variable.main.arrayLamp.push(name);
        return true;
    }
    catch(error) {
        return error;
    } 
}

exports.removeLight = (name) =>{
    try{
        let index = variable.main.arrayLamp.indexOf(name);
        variable.main.arrayLamp.splice(index, 1);
        return true;
    }
    catch(error) {
        return error;
    } 
}