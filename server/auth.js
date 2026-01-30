const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createAccessToken = (user) => {
	const data = {
		id : user._id,
		email : user.email,
		username : user.username,
		isAdmin : user.isAdmin
	}

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}


module.exports.verify = (req, res, next) => {

	let token = req.headers.authorization;

	if (token === undefined) {
		return res.status(403).send({ auth : "Failed. No token." });
	}

	token = token.slice(7, token.length);

	jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
		if (err) {
			console.error("Verification Failed");
			return res.status(403).send({
				auth : "Failed",
				message : err.message
			});
		} else {
			req.user = decodedToken;
			next();
		}
	});
}

module.exports.verifyAdmin = (req, res, next) => {
	if (req.user.isAdmin) {
		next();
	} else {
		return res.status(403).send({
			auth : "Failed.",
			message : "Action Forbidden."
		});
	}
}

module.exports.errorHandler = (err, req, res, next) => {
	console.error(err);

	const statusCode = err.status || 500;
	const statusMessage = err.message || "Internal Server Error";

	return res.status(statusCode).send({
		message : statusMessage,
		details : err.details || null
	});
}