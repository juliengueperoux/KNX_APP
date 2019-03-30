const functions = require('../functions'); 
const KNXConfigModel = require('../models/knxConfig')

exports.addConfig = (req,res) =>{
    const config = {
        idUser: req.apiToken._id,
        ipaddr: req.body.ipaddr,
        port : req.body.port
    }
    KNXConfigModel.findOne({
        $and:[
            {idUser: req.apiToken._id},
            {ipaddr: req.body.ipaddr},
            {port : req.body.port}
            ]
    }, 
    (err, result) => {
        if(err) return res.send({success : false, errorMessage : "Erreur lors de l'ajout d'une nouvelle configuration KNX: "+err})
        if(result) return res.send({success:false, errorMessage : "Une configuration de machine KNX éxiste déjà avec ces options"})
        else{
            KNXConfigModel.create(config, (err, result) => {
                if(err) return res.send({success : false, errorMessage : "Erreur lors de l'ajout d'une nouvelle configuration KNX: "+err})
                return res.send({success:true});
          })
        }
    })
}

exports.deleteConfig = (req,res) =>{
    KNXConfigModel.findOne({
        $and:[
            {idUser: req.apiToken._id},
            {ipaddr: req.body.ipaddr},
            {port : req.body.port}
            ]
    }, 
    (err, result) => {
        if(err) return res.send({success : false, errorMessage : "Erreur lors de la suppression de la configuration KNX: "+err})
        if(!result) return res.send({success:false, errorMessage : "Aucune machine KNX n'éxiste avec ces options"})
        else{
            KNXConfigModel.deleteOne({
                $and:[
                    {idUser: req.apiToken._id},
                    {ipaddr: req.body.ipaddr},
                    {port : req.body.port}
                    ]}
                , (err, result) => {
                if(err) return res.send({success : false, errorMessage : "Erreur lors de la suppression de la configuration KNX: "+err})
                return res.send({success:true});
          })
        }
    })
}

exports.findMyConfigs = (req,res) =>{
    KNXConfigModel.find({idUSer: req.apiToken._id}, (err, results) => {
        if(err) return res.send({success : false, errorMessage : "Erreur lros de la récupération des configurations KNX: "+err})
        return results
    })
}

exports.connect = (req,res) =>{
    var state = functions.connectionKnx();
    if (state) {
        res.send({success:true})
        // ajouter dans la socket que le mec c'est co à la machine KNX
     }
     else res.send(state);
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

exports.setInterval = (req, res) => {
    var state = functions.setInterval(req.params.value);
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

exports.getAllLight = (req, res) => { 
    var state = functions.getAllLight();
    (state.success) ? res.send(state.data) : res.send(state);
};

exports.addLight = (req, res) => { 
    var state = functions.addLight(req.params.name);
    (state) ? res.send({success:true}) : res.send(state);
};

exports.removeLight = (req, res) => { 
    var state = functions.removeLight(req.params.name);
    (state) ? res.send({success:true}) : res.send(state);
};