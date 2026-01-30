const BlogPost = require("../models/BlogPost");
const { errorHandler } = require("../auth");
const { cloudinary } = require("../cloudinaryConfig");

module.exports.createBlogPost = (req, res) => {
	BlogPost.create({
		userId : req.user.id,
		title : req.body.title,
		content : req.body.content,
		picture : req.body.picture,
		comments : [],
		likes : []
	})
	.then(post => {
		return res.status(201).send({
			success : true,
			message : "Post created successfully."
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.getBlogPost = (req, res) => {
	BlogPost.findById(req.params.blogPostId)
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found."});

		return res.status(200).send(post);
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.getBlogPostsPerUser = (req, res) => {
	BlogPost.find({ userId : req.params.userId })
	.sort({ creationDate : -1})
	.then(posts => {
		return res.status(200).send(posts);
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.getAllPosts = (req, res) => {
	BlogPost.find()
	.sort({ creationDate : -1})
	.then(posts => {
		return res.status(200).send(posts);
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.updatePost = (req, res) => {
	const allowedFields = ["title", "content"]
	
	let query = {};

	allowedFields.forEach(field => {
		if (req.body[field] !== undefined) {
			query[field] = req.body[field]
		}
	});

	BlogPost.findByIdAndUpdate(req.params.blogPostId, query, {new : true})
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found."});

		return res.status(200).send({
			success : true,
			message : "Post updated successfully.",
			updatedPost : post
		});

	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.updatePostPicture = (req, res) => {
	BlogPost.findByIdAndUpdate(req.params.blogPostId, {
		picture : req.body.picture
	})
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found." });

		let oldPicture = post.picture?.filename || null;

		if (oldPicture) {
			cloudinary.uploader.destroy(oldPicture, (error, result) => {
				if (error) {
					console.error("Cloudinary delete error: ", error);
				} else {
					console.log("Cloudinary delete result: ", result);
				}
			});
		}

		return res.status(200).send({
			success : true,
			message : "Picture updated successfully.",
			udpatedPost : post
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.deletePost = (req, res) => {
	BlogPost.findByIdAndDelete(req.params.blogPostId)
	.then(result => res.status(200).send({ success : true, message : "Post deleted."}))
	.catch(error => errorHandler(error, req, res));
}

module.exports.commentOnPost = (req, res) => {
	BlogPost.findById(req.params.blogPostId)
	.then(post => {
		if (!post) return Promise.reject("POST_NOT_FOUND");

		const newComment = {
			comment : req.body.comment,
			commentingUserId : req.user.id,
			commentedAt : Date.now()
		}

		post.comments.push(newComment);
		return post.save();
	})
	.then(commentedPost => {
		return res.status(200).send({
			success : true,
			message : "Comment created successfully."
		});
	})
	.catch(error => {
		if (error === "POST_NOT_FOUND") {
			return res.status(404).send({ message : "Post not found."});
		}

		return errorHandler(error, req, res);
	});
}

module.exports.updateComment = (req, res) => {
	BlogPost.findOneAndUpdate({ _id : req.params.blogPostId, "comments._id" : req.body.commentId }, {
		$set : {
			"comments.$.comment" : req.body.newComment
		}
	}, {new : true})
	.then(post => {
		if (!post) return res.status(404).send({message : "Post not found."})

		return res.status(200).send({
			success : true,
			message : "Comment edited successfully.",
			updatedPost : post
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.deleteComment = (req, res) => {
	BlogPost.findById(req.params.blogPostId)
	.then(post => {
		if (!post) return Promise.reject("POST_NOT_FOUND");

		post.comments.pull(req.body.commentId);
		return post.save();
	})
	.then(updatedPost => res.status(200).send({success : true, message : "Comment deleted successfully."}))
	.catch(error => {
		if (error === "POST_NOT_FOUND") return res.status(404).send({ message : "Post not found."});
		return errorHandler(error, req, res);
	});
}


module.exports.likePost = (req, res) => {
	BlogPost.findByIdAndUpdate(req.params.blogPostId, {
		$addToSet : { likes : req.user.id },
		$pull : { dislikes : req.user.id }
	},
	{new : true})
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found."});

		return res.status(200).send({
			success : true,
			message : "Post Liked.",
			likes : post.likes.length,
			dislikes : post.dislikes.length
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.dislikePost = (req, res) => {
	BlogPost.findByIdAndUpdate(req.params.blogPostId, {
		$addToSet : { dislikes : req.user.id },
		$pull : { likes : req.user.id }
	},
	{new : true})
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found."});

		return res.status(200).send({
			success : true,
			message : "Post Disliked.",
			likes : post.likes.length,
			dislikes : post.dislikes.length
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.unLikePost = (req, res) => {
	BlogPost.findByIdAndUpdate(req.params.blogPostId, {
		$pull : { likes : req.user.id }
	},
	{new : true})
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found."});

		return res.status(200).send({
			success : true,
			message : "Removed like.",
			likes : post.likes.length,
			dislikes : post.dislikes.length
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.unDislikePost = (req, res) => {
	BlogPost.findByIdAndUpdate(req.params.blogPostId, {
		$pull : { dislikes : req.user.id }
	},
	{new : true})
	.then(post => {
		if (!post) return res.status(404).send({ message : "Post not found."});

		return res.status(200).send({
			success : true,
			message : "Removed dislike.",
			likes : post.likes.length,
			dislikes : post.dislikes.length
		});
	})
	.catch(error => errorHandler(error, req, res));
}