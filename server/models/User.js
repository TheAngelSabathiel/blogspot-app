const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName : {
		type : String,
		default : ""
	},
	lastName : {
		type : String,
		default : ""
	},
	email : {
		type : String,
		required : [true, "Email is required"],
		unique : true
	},
	password : {
		type : String,
		required : [true, "Password is required"]
	},
	username : {
		type : String,
		required : [true, "Username is required"],
		unique : true
	},
	displayInfo : {
		type : String,
		default : ""
	},
	picture : {
		path : {
			type : String,
			default : null
		},
		filename : {
			type : String,
			default : null
		}
	},
	isAdmin : {
		type : Boolean, 
		default : false
	},
	createdAt : {
		type : Date,
		default : Date.now()
	}
});

module.exports = mongoose.model("User", userSchema);