const mongoose = require('mongoose');

const Scnearios = new mongoose.Schema({
	name: {
		type : String,
		resuired : true
	},
	idKnx: {
		type: String,
		required: true,
    },
    nameKnx: {
		type: String,
		required: true,
    },
    
	lights:[
		{
          id: String,
          name: String
		}
    ],
    action: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    repetition:{
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Scnearios', Scnearios);