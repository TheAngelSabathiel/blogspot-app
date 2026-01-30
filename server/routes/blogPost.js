const blogPostController = require("../controllers/blogPost");
const { verify, verifyAdmin } = require("../auth");
const express = require("express");
const router = express.Router();

router.post("/", verify, blogPostController.createBlogPost);

router.get("/details/:blogPostId", blogPostController.getBlogPost);

router.get("/blogs/:userId", blogPostController.getBlogPostsPerUser);

router.get("/", blogPostController.getAllPosts);

router.put("/update/:blogPostId", verify, blogPostController.updatePost);

router.patch("/update-pic/:blogPostId", verify, blogPostController.updatePostPicture);

router.delete("/delete/:blogPostId", verify, blogPostController.deletePost);

router.post("/comment/:blogPostId", verify, blogPostController.commentOnPost);

router.patch("/comment/:blogPostId", verify, blogPostController.updateComment);

router.delete("/comment/:blogPostId", verify, blogPostController.deleteComment);

router.patch("/like/:blogPostId", verify, blogPostController.likePost);

router.patch("/dislike/:blogPostId", verify, blogPostController.dislikePost);

router.patch("/unlike/:blogPostId", verify, blogPostController.unLikePost);

router.patch("/undislike/:blogPostId", verify, blogPostController.unDislikePost);

module.exports = router;