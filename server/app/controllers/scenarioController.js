
const ScenarioModel = require('../models/scenario')
const functions = require('../functions');

exports.addScenario = (req, res) => {
    console.log("ICI : " + JSON.stringify(req.body));
    const config = {
        name: req.body.name,
        idKnx: req.body.idKnx,
        nameKnx: req.body.nameKnx,
        action: req.body.action,
        lights: req.body.lights,
        time: req.body.time,
        repetition:req.body.repetition 
    }
    ScenarioModel.create(config, (err, result) => {
        if (err) return res.send({
            success: false,
            errorMessage: "Erreur lors de l'ajout d'un Scénario : " + err
        })

        functions.addScenario(result)
        return res.send({
            success: true, data : result
        });
    })
}

exports.deleteScenario = (req, res) => {
    ScenarioModel.findOne({_id : req.params.id},
        (err, result) => {
            if (err) return res.send({
                success: false,
                errorMessage: "Erreur lors de la suppression du scénario : " + err
            })
            if (!result) return res.send({
                success: false,
                errorMessage: "Aucune scénario n'éxiste avec ces options"
            })
            else {
                ScenarioModel.deleteOne({_id: result._id}, (err, result) => {
                    if (err) return res.send({
                        success: false,
                        errorMessage: "Erreur lors de la suppression du scénario KNX: " + err
                    })

                    const indexScenario = functions.scenarioList.findIndex(i => i._id === req.params.id);
                    if(indexScenario > -1) functions.connectionsList.splice(indexScenario,1)

                    return res.send({
                        success: true
                    });
                })
            }
    })
}

exports.findAll = (req,res) =>{
    ScenarioModel.find({}, (err, results) =>{
        if(err) console.log(err);
        return res.send(results);
    });
};

//** FAIRE UNE METHODE QUI RECUPERE LES SCENARIO A LAISSER AU BON MOMENTS (TOUTE LES MINUTES) */