const functions = require('../functions'); 

exports.test = (req, res) => {
    res.send("test");
};

exports.connect = (req,res) =>{
    functions.connectionKnx();
}

exports.disconnect = (req,res) =>{
    functions.deconnectionKnx();
}

exports.startLamp = (req, res) => {
    functions.startLamp();
};

exports.stopLamp = (req, res) => {
    functions.stopLamp();
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