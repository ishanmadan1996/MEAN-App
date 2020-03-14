const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const PostController = require("../controllers/posts")

router.post("",
  checkAuth,
  extractFile,
  PostController.createPost);

router.get("/:id",PostController.getPost)
router.get("",PostController.getPosts);

router.put("/:id",
checkAuth,
extractFile,
PostController.updatePost
)

router.delete("/:id",
checkAuth,
PostController.deletePost
);

module.exports = router;
