var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var surverysSchema = new Schema({
	institution: {
		four_year: Boolean,
		two_year: Boolean,
		research: Boolean,
		teaching: Boolean,
		vocational_or_technical: Boolean,
		none: Boolean,
		other: Boolean
	},
    category:{
        type: String
    },
    heard_from: {
		collegue: Boolean,
		newsletter: Boolean,
		email: Boolean,
		web_search: Boolean,
		conference: Boolean,
		periodical: Boolean,
		other: Boolean
	},
	email: {
		type: String
	}
});

module.exports = mongoose.model('Surverys', surverysSchema);
