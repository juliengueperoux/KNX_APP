const mongoose = require('mongoose');

const KNXConfig = new mongoose.Schema({
    idUSer:{
        type:String,
        required:true
    },
	ipAddr: {
		type: String,
		required: true,
	},
	port: {
		type: Number,
		required: true
    }
});

module.exports = mongoose.model('KNXConfig', KNXConfig);
