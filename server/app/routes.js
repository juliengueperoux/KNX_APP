const express = require('express');
const knxController = require('./controllers/knxController');
const scenarioController = require('./controllers/scenarioController');

module.exports = (app,auth) => {

    app.get('/api/kniot/connect/:idKnx',auth.isAuth, knxController.connect);
    app.get('/api/kniot/disconnect/:idKnx',auth.isAuth,  knxController.disconnect);

    app.get('/api/kniot/startAllLights/:idKnx',auth.isAuth,  knxController.startAllLights);
    app.get('/api/kniot/stopAllLights/:idKnx',auth.isAuth,  knxController.stopAllLights);

    app.post('/api/kniot/startLight',auth.isAuth,  knxController.startLight);
    app.post('/api/kniot/stopLight',auth.isAuth,  knxController.stopLight);

    app.get('/api/kniot/startChase/:idKnx',auth.isAuth,  knxController.startChase);
    app.get('/api/kniot/stopChase/:idKnx',auth.isAuth,  knxController.stopChase);
    app.post('/api/kniot/interval',auth.isAuth, knxController.setInterval)
    app.get('/api/kniot/reverse/:idKnx',auth.isAuth,  knxController.reverse);

    //SETTINGS
    app.get('/api/kniot/allLight/:idKnx',auth.isAuth, knxController.getAllLight)    
    app.post('/api/kniot/addLight',auth.isAuth, knxController.addLight)
    app.post('/api/kniot/removeLight',auth.isAuth, knxController.removeLight)

    app.post('/api/kniot/addKnxConfig', auth.isAuth, knxController.addConfig)
    app.post('/api/kniot/updateKnxConfig/', auth.isAuth, knxController.updateConfig)
    app.get('/api/kniot/deleteKnxConfig/:idKnx', auth.isAuth, knxController.deleteConfig)
    app.get('/api/kniot/findKNXConfigs',auth.isAuth, knxController.findConfigs)

    // SCENARIO 
    app.post('/api/kniot/addScenario', auth.isAuth, scenarioController.addScenario)
    app.get('/api/kniot/deleteScenario/:id', auth.isAuth, scenarioController.deleteScenario)
    app.get('/api/kniot/findAllScenario',auth.isAuth, scenarioController.findAll)


    //AUTH
    app.post('/api/login', auth.login);
    app.get('/api/logout', auth.logout);

    // Si on appel une autre route qui n'est pas défini au dessus on charge le fichier suivant : index.html
    app.get('*', (req, res) => {
        res.send({success:false,errorMessage:'route non valide'})
     });
}


