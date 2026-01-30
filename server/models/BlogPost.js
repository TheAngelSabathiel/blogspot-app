const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
	userId : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "User"
	},
	title : {
		type : String, 
		required : [true, "Title is required"]
	},
	content : {
		type : String,
		required : [true, "Content is required"]
	},
	picture : {
		path : { type : String, default : null },
		fileName : { type : String, default : null }
	},
	comments : [
		{
			comment : { type : String },
			commentingUserId : { type : mongoose.Schema.Types.ObjectId, ref : "User" },
			commentedAt : { type : Date }
		}
	],
	likes : [
		{ type : mongoose.Schema.Types.ObjectId, ref : "User" }
	],
	dislikes : [
		{ type : mongoose.Schema.Types.ObjectId, ref : "User" }
	],
	creationDate : {
		type : Date, 
		default : Date.now()
	}
});

module.exports = mongoose.model("BlogPost", blogPostSchema);