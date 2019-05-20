const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./app/routes');
const mongoose = require('mongoose');
const auth = require('./app/middlewares/auth');
const io = require('./app/webSocket')
const functions = require('./app/functions');

//maquettefing1

app.use(cookieParser())

app.use(morgan('combined'));
app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(express.static('static'));

router(app,auth);

let db = require('./config/config');
console.log('dburl : '+db.url)
mongoose.connect(db.url,{ useNewUrlParser: true }); 

mongoose.connection.on('connected', () => {
   console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
   console.log('MongoDB connection error : ' + err);
});

mongoose.connection.on('disconnected', () => {
   console.log('MongoDB connection close')
});

http.createServer(app).listen(port,'0.0.0.0', () => {
   console.log('Listening on ' + port);
   functions.initConnections()
   functions.initScenarios()
});


module.exports.app = app
exports = module.exports
