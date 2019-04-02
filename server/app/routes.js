const express = require('express');
const knxController = require('./controllers/knxController');
module.exports = (app,auth) => {

    app.get('/api/kniot/connect',auth.isAuth, knxController.connect);
    app.get('/api/kniot/disconnect',auth.isAuth,  knxController.disconnect);

    app.get('/api/kniot/startAllLights',auth.isAuth,  knxController.startAllLights);
    app.get('/api/kniot/stopAllLights',auth.isAuth,  knxController.stopAllLights);

    app.get('/api/kniot/startLight/:id',auth.isAuth,  knxController.startLight);
    app.get('/api/kniot/stopLight/:id',auth.isAuth,  knxController.stopLight);

    app.get('/api/kniot/startChase',auth.isAuth,  knxController.startChase);
    app.get('/api/kniot/stopChase',auth.isAuth,  knxController.stopChase);
    app.get('/api/kniot/inteval/:value',auth.isAuth, knxController.setInterval)
    app.get('/api/kniot/interval/up',auth.isAuth,  knxController.setUpInterval);
    app.get('/api/kniot/interval/down',auth.isAuth,  knxController.setDownInterval);
    app.get('/api/kniot/reverse',auth.isAuth,  knxController.reverse);

    //SETTINGS
    app.get('/api/kniot/allLight',auth.isAuth, knxController.getAllLight)    
    app.get('/api/kniot/addLight/:name',auth.isAuth, knxController.addLight)
    app.get('/api/kniot/removeLight/:name',auth.isAuth, knxController.removeLight)

    app.post('/api/kniot/addKnxConfig', auth.isAuth, knxController.addConfig)
    app.post('/api/kniot/deleteKnxConfig', auth.isAuth, knxController.deleteConfig)
    app.get('/api/kniot/fingMyKNXConfigs',auth.isAuth, knxController.findConfigs)

    //AUTH
    app.post('/api/login', auth.login);
    app.get('/api/logout', auth.logout);

    // Si on appel une autre route qui n'est pas défini au dessus on charge le fichier suivant : index.html
    app.get('*', (req, res) => {
        res.send({success:false,errorMessage:'route non valide'})
     });
}


