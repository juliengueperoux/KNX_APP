const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
    },
    mail : {
		type: String,
		required: true,
		unique: true
	},
	reset_password_token : String,
	reset_password_expires : Date,
	
	admin : { type: Boolean, default: false },
	validAccount : {
		type : Boolean,
		default : true
	}

});

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password, callback) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if(err) return callback(err);
		callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);
