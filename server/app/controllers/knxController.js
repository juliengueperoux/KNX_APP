const functions = require('../functions'); 

exports.connect = (req,res) =>{
    var state = functions.connectionKnx();
    (state) ? res.send({success:true}) : res.send(state);
}

exports.disconnect = (req,res) =>{
    var state = functions.deconnectionKnx();
    (state) ? res.send({success:true}) : res.send(state);
}

exports.startAllLights = (req, res) => {
    var state = functions.startAllLights();
    (state) ? res.send({success:true}) : res.send(state);
};

exports.stopAllLights = (req, res) => {
    var state = functions.stopAllLights();
    (state) ? res.send({success:true}) : res.send(state);
};

exports.startLight = (req,res) => {
    const id = req.params.id;
    var state = functions.startLight(id);
    (state) ? res.send({success:true}) : res.send(state);
}

exports.stopLight = (req,res) => {
    const id = req.params.id;
    var state = functions.stopLight(id);
    (state) ? res.send({success:true}) : res.send(state);
}

exports.startChase = (req, res) => {
    var state = functions.startChase();
    (state) ? res.send({success:true}) : res.send(state);
};

exports.stopChase = (req, res) => {
    var state = functions.stopChase();
    (state) ? res.send({success:true}) : res.send(state);
};


exports.setUpInterval = (req, res) => {
    var state = functions.setUpInterval();
    (state) ? res.send({success:true}) : res.send(state);
};

exports.setDownInterval = (req, res) => {
    var state = functions.setDownInterval();
    (state) ? res.send({success:true}) : res.send(state);
};

exports.reverse = (req, res) => {
    var state = functions.reverse();
    (state) ? res.send({success:true}) : res.send(state);
};