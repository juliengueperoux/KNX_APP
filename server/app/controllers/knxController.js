const functions = require('../functions');
const KNXConfigModel = require('../models/knxConfig')
const ScenarioModel = require('../models/scenario')
exports.addConfig = (req, res) => {
    const config = {
        ipAddr: req.body.ipAddr,
        port: req.body.port,
        lights : req.body.lights,
        name : req.body.name
    }
    KNXConfigModel.findOne({
            $and: [
                {
                    ipAddr: req.body.ipAddr
                },
                {
                    port: req.body.port
                }
            ]
        },
        (err, result) => {
            if (err) return res.send({
                success: false,
                errorMessage: "Erreur lors de l'ajout d'une nouvelle configuration KNX: " + err
            })
            if (result) return res.send({
                success: false,
                errorMessage: "Une configuration de machine KNX éxiste déjà avec ces options"
            })
            else {
                KNXConfigModel.create(config, (err, result) => {
                    if (err) return res.send({
                        success: false,
                        errorMessage: "Erreur lors de l'ajout d'une nouvelle configuration KNX: " + err
                    })
                    functions.addConnection(result)
                    return res.send({
                        success: true
                    });
                })
            }
        })
}

exports.updateConfig = (req, res) => {
    console.log(JSON.stringify(req.body))
    KNXConfigModel.findOne({name: req.body.name}, 
        (err, result) => {
            if(err) return res.status(409);
            if(result) return res.send({success : false, errorMessage : "Une machine porte déja ce nom"});
            else {
                const id = req.body._id;
                const data = req.body;
                KNXConfigModel.update({"_id":id}, data, (err, result) => {
                    if(err){
                        return res.status(409).send({success : false, errorMessage : ""})
                    }else{
                        
                        return res.status(202).send({success : true});
                    }
                });
            }
        });
};

exports.deleteConfig = (req, res) => {
    KNXConfigModel.findOne({_id : req.params.idKnx},
        (err, result) => {
            if (err) return res.send({
                success: false,
                errorMessage: "Erreur lors de la suppression de la configuration KNX: " + err
            })
            if (!result) return res.send({
                success: false,
                errorMessage: "Aucune machine KNX n'éxiste avec ces options"
            })
            else {
                ScenarioModel.deleteMany({idKnx  :result._id},(errScenario, resultScenario)=>{
                    if(errScenario) return res.send({success : false, errorMessage : "Erreur lors de la suppression des Scenarios: "+errScenario})
                    functions.scenarioList = functions.scenarioList.filter( el => {return !(el.idKnx === result._id)});
                    KNXConfigModel.deleteOne({_id: result._id}, (err, result) => {
                        if (err) return res.send({
                            success: false,
                            errorMessage: "Erreur lors de la suppression de la configuration KNX: " + err
                        })
    
                        const indexConnection = functions.connectionsList.findIndex(i => i._id === req.params.idKnx);
                        if(indexConnection > -1) functions.connectionsList.splice(indexConnection,1)
                        functions.connectionsList = functions.connectionsList.filter( el => {return !(el._id === result._id)});
                        return res.send({
                            success: true
                        });
                    })
                })
            }
        })
}

exports.findConfigs = (req,res) => {
    let configs = functions.connectionsList;
    configs = configs.map(elt => elt.params)
    res.send(configs)
}

exports.connect = (req, res) => {
    var state = functions.connectionKnx(req.params.idKnx);
    if (state) {
        res.send({
            success: true
        })
        // ajouter dans la socket que le mec c'est co à la machine KNX
    } else res.send(state);
}

exports.disconnect = (req, res) => {
    var state = functions.deconnectionKnx(req.params.idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
}

exports.startAllLights = (req, res) => {
    var state = functions.startAllLights(req.params.idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
};

exports.stopAllLights = (req, res) => {
    var state = functions.stopAllLights(req.params.idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
};

exports.startLight = (req, res) => {
    const id = req.body.id;
    const idKnx = req.body.idKnx
    var state = functions.startLight(id,idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
}

exports.stopLight = (req, res) => {
    const id = req.body.id;
    const idKnx = req.body.idKnx
    var state = functions.stopLight(id,idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
}

exports.startChase = (req, res) => {
    const idKnx = req.params.idKnx
    functions.startChase(idKnx).then((state)=>{
        (!state.success) ? res.send(
            state.errorMessage
        ): res.send({success: true});
    })
};

exports.stopChase = (req, res) => {
    const idKnx = req.params.idKnx
    var state = functions.stopChase(idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
};

exports.setInterval = async (req, res) => {
    const interval = req.body.interval;
    const idKnx = req.body.idKnx
    var state = await functions.setInterval(interval,idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
};

exports.reverse = async (req, res) => {
    var state = await functions.reverse(req.params.idKnx);
    (!state.success) ? res.send(
        state.errorMessage
    ): res.send({success: true});
};

exports.getAllLight = (req, res) => {
    var state = functions.getAllLight(req.params.idKnx);
    (state.success) ? res.send(state.data): res.send(state);
};

exports.addLight = (req, res) => {
    const light = req.body.light;
    const idKnx = req.body.idKnx
    var state = functions.addLight(light,idKnx);
    addLightFunction(light,idKnx,res);
};

exports.updateLight = (req, res) => {
    const light = req.body.light;
    const idKnx = req.body.idKnx
    //functions.removeLight(light,idKnx);
    updateLightFunction(light,idKnx,res);
}

exports.removeLight = (req, res) => {
    const light = req.body.light;
    const idKnx = req.body.idKnx
    functions.removeLight(light,idKnx);
    removeLightFunction(light,idKnx,res);
};

addLightFunction = (light,idKnx,res)=>{
    KNXConfigModel.findOneAndUpdate(
        { _id: idKnx }, 
        { $push: { lights: light } },
        (error, resultat) => {
            if(error) res.send({success:false, errorMessage:"Erreur lors de l'ajout de la lampe dans la base de données: "+error})
            else res.send({success:true})
        });
}

updateLightFunction = (light,idKnx,res)=>{
    KNXConfigModel.findOneAndUpdate(
        { _id: idKnx }, 
        { $set: { light: light } },
        (error, resultat) => {
            if(error) res.send({success:false, errorMessage:"Erreur lors de l'update de la lampe dans la base de données: "+error})
            else res.send({success:true})
        });
}

removeLightFunction = (light,idKnx,res)=>{
    KNXConfigModel.findOneAndUpdate(
        { _id: idKnx }, 
        { $set: { lights: light  } },
        (error, resultat) => {
             if(error) res.send({success:false, errorMessage:"Erreur lors de la suppression de la lampe dans la base de données: "+error})
             else res.send({success:true})
         });
}

