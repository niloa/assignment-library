var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tags = require("./tags");
var assignmentsSchema = new Schema({
	name: {
		type: String,
		required: true
	},
    author:{
        type: String
    },
    citation: {
    	type: String
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
		type: Number,
		required: true
	},
	assignment_type: {
		type: String,
		required: true
	},
	tags: [],
    rubricsData: []

    /*tags: [{
		mapped_id: String,
		primary_tag: String,
		secondary_tag: String}]*/
});

assignmentsSchema.index({name: 1, created_at: 1}, {unique: true});
module.exports = mongoose.model('Assignments', assignmentsSchema);
