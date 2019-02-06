const express = require('express');
const knxController = require('./controllers/knxController');

module.exports = (app) => {
    app.get('/api/kniot/test',  knxController.test);
}



/*
module.exports = (app,auth) => {
    //appel du controller
    const user = require('./controllers/userController');
    //USERS
   
    app.get('/api/user/delete', auth.isAuth,  user.delete);
    app.post('/api/user/update', auth.isAuth,  user.update);
    app.get('/api/user/getmyreservations', auth.isAuth, user.getMyReservations);
    app.get('/api/user/findifexist',auth.isAdmin, user.findIfExist);
    app.get('/api/user/:id', auth.isAdmin,  user.findOne);
    app.get('/api/user/delete/:id', auth.isAdmin,  user.deleteAdmin);
    app.post('/api/user/update/:id', auth.isAdmin,  user.updateAdmin);
    app.post('/api/user/create', auth.isAdmin,  user.add);
    app.get('/api/users', auth.isAdmin,  user.findAll);   


    const room = require('./controllers/roomController');
    app.post('/api/room/create', auth.isAdmin, room.add);
    app.get('/api/rooms', auth.isAuth, room.findAll);
    app.get('/api/room/delete/:id', auth.isAdmin, room.delete);
    app.post('/api/room/update/:id', auth.isAdmin, room.update);
    app.post('/api/room/addreservation/:id', auth.isAuth, room.addReservation);
    app.post('/api/room/removereservation/:id', auth.isAuth, room.removeReservation);
    app.get('/api/room/findifexist',auth.isAdmin, room.findIfExist);
    app.get('/api/room/findReservations',auth.isAdmin, room.findReservations);
    app.get('/api/room/:id', auth.isAuth, room.find);

    const building = require('./controllers/buildingController');
    app.get('/api/building', auth.isAuth, building.findAll);
    app.post('/api/building/create', auth.isAdmin, building.add);
    app.get('/api/building/delete/:id', auth.isAdmin, building.delete);
    app.post('/api/building/update/:id', auth.isAdmin, building.update);
    app.get('/api/building/findifexist',auth.isAdmin, building.findIfExist);
    app.get('/api/building/:id', auth.isAuth, building.find);

    //AUTH
    app.post('/api/login', auth.login);
    app.get('/api/logout', auth.logout);
    
    // Si on appel une autre route qui n'est pas défini au dessus on charge le fichier suivant : index.html
    app.get('*', (req, res) => {
       res.sendFile('public/index.html')
    });
}

*/