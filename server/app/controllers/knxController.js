const functions = require('../functions'); 

exports.connect = (req,res) =>{
    functions.connectionKnx();
}

exports.disconnect = (req,res) =>{
    functions.deconnectionKnx();
}

exports.startAllLights = (req, res) => {
    functions.startAllLights();
};

exports.stopAllLights = (req, res) => {
    functions.stopAllLights();
};

exports.startLight = (req,res) => {
    const id = req.params.id;
    functions.startLight(id);
}

exports.stopLight = (req,res) => {
    const id = req.params.id;
    functions.stopLight(id);
}

exports.startChase = (req, res) => {
    functions.startChase();
};

exports.stopChase = (req, res) => {
    functions.stopChase();
};


exports.setUpInterval = (req, res) => {
    functions.setUpInterval();
};

exports.setDownInterval = (req, res) => {
    functions.setDownInterval();
};

exports.reverse = (req, res) => {
    functions.reverse();
};