
const jwt = require('jsonwebtoken');
const fs = require ('fs')

const publicKey = fs.readFileSync('./config/publicKey.pem')

// Authentification pour la création de la socket entre le client et le serveur
exports.authenticate = (data, callback) => {
	let token = data.token
	if(token.length >= 1 && token.indexOf('JWT ')!=-1)
	token = token.split("JWT ")[1];
    if(!token) return callback(new Error("No Token"))
	else {
		jwt.verify(token, publicKey, (err, decodedToken) => {
			if(err) return callback(new Error("Invalid Auth"+err))
			else {
				return callback(null,true)
			}
		})
    }
};
