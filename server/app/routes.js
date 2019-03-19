const express = require('express');
const knxController = require('./controllers/knxController');

module.exports = (app) => {

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

}


