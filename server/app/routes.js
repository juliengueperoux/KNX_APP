const express = require('express');
const knxController = require('./controllers/knxController');

module.exports = (app,auth) => {
    app.get('/api/kniot/test',  knxController.test);

    app.get('/api/kniot/connect',  knxController.connect);
    app.get('/api/kniot/disconnect',  knxController.disconnect);

    app.get('/api/kniot/startAllLights',  knxController.startAllLights);
    app.get('/api/kniot/stopAllLights',  knxController.stopAllLights);

    app.get('/api/kniot/startLight/:id',  knxController.startLight);
    app.get('/api/kniot/stopLight/:id',  knxController.stopLight);


    app.get('/api/kniot/startChase',  knxController.startChase);
    app.get('/api/kniot/stopChase',  knxController.stopChase);
    app.get('/api/kniot/interval/up',  knxController.setUpInterval);
    app.get('/api/kniot/interval/down',  knxController.setDownInterval);

    app.get('/api/kniot/reverse',  knxController.reverse);

    //AUTH
    app.post('/api/login', auth.login);
    app.get('/api/logout', auth.logout);

    // Si on appel une autre route qui n'est pas défini au dessus on charge le fichier suivant : index.html
    app.get('*', (req, res) => {
        res.send({success:false,errorMessage:'route non valide'})
     });
}


