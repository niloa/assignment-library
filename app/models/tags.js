var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagsSchema = new Schema({
	primary_tag: {
		type: String,
		required: true
	},
	secondary_tag: {
		type: String,
		required: true,
		index: true
	}
});

tagsSchema.index({primary_tag: 1, secondary_tag: 1}, {unique: true});
module.exports = mongoose.model('Tags', tagsSchema);
