const express = require('express');
const knxController = require('./controllers/knxController');

module.exports = (app) => {
    app.get('/api/kniot/test',  knxController.test);

    app.get('/api/kniot/connect',  knxController.connect);
    app.get('/api/kniot/disconnect',  knxController.disconnect);

    app.get('/api/kniot/startLamp',  knxController.startLamp);
    app.get('/api/kniot/stopLamp',  knxController.stopLamp);

    app.get('/api/kniot/interval/up',  knxController.setUpInterval);
    app.get('/api/kniot/interval/down',  knxController.setDownInterval);

    app.get('/api/kniot/reverse',  knxController.reverse);

}


