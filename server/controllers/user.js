const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { errorHandler, createAccessToken } = require("../auth");
const { cloudinary } = require("../cloudinaryConfig");

module.exports.registerUser = (req, res) => {
	const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
	const usernameRegex = /^[^\s@]+$/;

	if (!emailRegex.test(req.body.email)) {
		return res.status(400).send({ message : "Invalid email."});
	}

	if (req.body.password.length < 8 ) {
		return res.status(400).send({ message : "Passwords must be at least 8 characters."});
	}

	if (!usernameRegex.test(req.body.username)) {
		return res.status(400).send({ message : "Usernames must not contain spaces nor '@' symbol" });
	}

	Promise.all([
		User.findOne({ email : req.body.email }),
		User.findOne({ username : req.body.username }),
		bcrypt.hash(req.body.password, 12)
	])
	.then(([foundUser1, foundUser2, hashedPassword]) => {
		if (foundUser1) {return res.status(400).send({ message : "Email already in use." });} 
		if (foundUser2) {return res.status(400).send({ message : "Username already in use." });}

		const user = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			password : hashedPassword,
			username : req.body.username
		});

		return user.save()
	})
	.then(savedUser => {

		const userResponse = savedUser.toObject();
		delete userResponse.password;

		return res.status(201).send({
			message : "User account created successfully.",
			user : userResponse
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.loginUser = (req, res) => {
	const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

	let query = { email : req.body.email };

	if (!emailRegex.test(req.body.email)) {
		query = { username : req.body.email };
	} 

	User.findOne(query)
	.then(foundUser => {
		if (!foundUser) {
			return Promise.reject("USER_NOT_FOUND");
		}

		return bcrypt.compare(req.body.password, foundUser.password)
		.then(isPasswordCorrect => {
			return {
				user : foundUser,
				isPasswordCorrect : isPasswordCorrect
			};
		})
	})
	.then(user => {

		if (!user.isPasswordCorrect) {
			return res.status(401).send({ message : "Authentication failed. Check your submitted credentials." });
		}

		return res.status(200).send({
			message : "Logged In successfully.",
			access : createAccessToken(user.user)
		});
	})
	.catch(error => {
		if (error === "USER_NOT_FOUND") {
			return res.status(404).send({ message : "Authentication failed. Check your submitted credentials." });
		}

		return errorHandler(error, req, res);
	});
}

module.exports.getUserDetails = (req, res) => {
	User.findById(req.user.id)
	.select("-password")
	.then(user => {
		if (!user) {
			return res.status(404).send({ message : "User not found." });
		}

		return res.status(200).send(user);
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.updateUserInfo = (req, res) => {
	const allowedList = ["username", "firstName", "lastName", "displayInfo"];

	let query = {};

	allowedList.forEach(field => {
		if (req.body[field] !== undefined) {
			query[field] = req.body[field];
		}
	});

	if (Object.keys(query).length === 0) return res.status(400).send({ message : "No valid fields for update." });

	User.findByIdAndUpdate(req.user.id, query, {new : true})
	.select("-password")
	.then(updatedUser => {
		if (!updatedUser) return res.status(404).send({ message : "User not found." });
		return res.status(200).send({
			message : "User info updated successfully.",
			updatedUser : updatedUser
		})
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.changeProfilePic = (req, res) => {
	User.findByIdAndUpdate(req.user.id, { picture : req.body.picture })
	.then(user => {
		if (!user) return res.status(404).send({ message : "User not found." });

		const oldPicturePublicId = user.picture?.filename || null;

		if(oldPicturePublicId) {
			cloudinary.uploader.destroy(oldPicturePublicId, (error, result) => {
				if (error) {
					console.error("Cloudinary delete error: ", error);
				} else {
					console.log("Cloudinary delete result: ", result);
				}
			});
		}

		return res.status(200).send({
			success : true,
			message : "Profile picture updated successfully."
		});
	})
	.catch(error => errorHandler(error, req, res));
}