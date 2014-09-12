var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tags = require("../../app/models/tags");

var assignmentsSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	file_location: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		required: true
	},
	tags: [{type: Schema.Types.ObjectId, ref: 'Tags' }]
});

module.exports = mongoose.model('Assignments', assignmentsSchema);
