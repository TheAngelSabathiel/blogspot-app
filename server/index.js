const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// Routes
const userRoutes = require("./routes/user");
const blogPostRoutes = require("./routes/blogPost");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(cors());

mongoose.set("runValidators", true);
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.on("error", console.error.bind(console, "Database Connection Error."));
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."));

// Route Middlewares
app.use("/users", userRoutes);
app.use("/blogPosts", blogPostRoutes);


if (require.main === module) {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}.`);
	});
}

module.exports = { app, mongoose };