
/*
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

exports.init = passport => {
	let options = {};
	options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
	options.secretOrKey = config.secret;
	passport.use(new JwtStrategy(options, (jwt_payload, done) => {
		UserModel.findOne({id: jwt_payload.id}, (err, user) => {
			if(err) return done(err, false);
			if(user) done(null, user);
			else done(null, false);
		});
	}));
};

exports.isAuth = (req, res, next) => {
	let token = getToken(req.headers);
	if(!token) return res.status(401).send({success: false, msg: "Unauthorized"});
	else {
		jwt.verify(token, config.secret, (err, decodedToken) => {
			if(err) return res.status(401).send({success: false, msg: 'Token is invalid'});
			else {
				req.apiToken = decodedToken;
				next();
			}
		})
	}
};

exports.isAdmin = (req, res, next) => {
	let token = getToken(req.headers);
	if(!token) return res.status(401).send({success: false, msg: "Unauthorized"});
	else {
		jwt.verify(token, config.secret, (err, decodedToken) => {
			if(!decodedToken.admin){
				return res.status(401).send({success: false, msg: 'Not Admin'});
			}
			if(err) return res.status(401).send({success: false, msg: 'Invalid token'});
			else {
				req.apiToken = decodedToken;
				next();
			}
		})
	}
};

exports.login = (req, res) => {
		UserModel.findOne({"username":req.body.username}, (err, user) => {
		if(err) throw err;
		if(!user) return res.status(401).send({success: false, msg: 'Authentification failed. User not found'});
		else {
			user.validPassword(req.body.password, (err, isMatch) => {
				if(!isMatch || err) return res.status(401).send({success: false, msg: 'Authentification failed. Wrong password.'});
				else {
					let token = jwt.sign(user.toJSON(), config.secret, config.signOptions);
					return res.status(200).send({success: true, token: 'JWT ' + token, tokenExpiresIn : config.signOptions.expiresIn,"admin": user.admin});
				}
			})
		}
	});
};

exports.logout = (req, res) => {
	return res.status(200).send({success: false, token: null})
};

getToken = headers => {
	if (headers.authorization) {
		let parted = headers.authorization.split(' ');
		if(parted.length >= 1){
			return parted[parted.indexOf('JWT')+1];
		} 
		else return null;
	}
	else return null;
};
*/