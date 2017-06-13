var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
	url:{
		type: String,
		required: true
	},
	depth:{
		type: String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

var Url = module.exports = mongoose.model('Url', urlSchema);

module.exports.addUrl = function(url, callback){
	Url.create(url, callback);
}