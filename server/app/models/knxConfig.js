const mongoose = require('mongoose');

const KNXConfig = new mongoose.Schema({
	name : {
		type : String,
		resuired : true
	},
	ipAddr: {
		type: String,
		required: true,
	},
	port: {
		type: Number,
		required: true
	},
	lights:[
		{
		  id: String,
		  name: String
		}
	  ]
});

module.exports = mongoose.model('KNXConfig', KNXConfig);