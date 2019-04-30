const mongoose = require('mongoose');

const KNXConfig = new mongoose.Schema({
	name : {
		type : String,
		required : true
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
			name: String,
			state : Boolean,
			default : false
		}
	  ]
});

module.exports = mongoose.model('KNXConfig', KNXConfig);