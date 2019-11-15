var express  = require("express"),
	router   = express.Router({mergeParams:true}),
	Blog     = require("../models/blog"),
	Comment	 = require("../models/comment"),
	User     = require("../models/user"),
	passport = require("passport");

var middleware = require("../middleware");
	
// COMMENT CREATE
router.get("/new", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.send(err);
		} else {
			res.render("./comments/new", {blog: foundBlog});
		}
	});
});

router.post("/", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		Comment.create(req.body.comments, function(err, comment) {
			if(err) {
				res.send(err);
			} else {
				
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				foundBlog.comments.push(comment);
				foundBlog.save();
				res.redirect("/blogs/" + foundBlog._id);
			}
		});
	});
});

// COMMENT EDIT 
router.get("/:comment_id/edit", middleware.isCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("./comments/edit", {blog_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.isCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/blogs/" + req.params.id );
      }
   });
});

// COMMENT DESTROY 
router.delete("/:comment_id", middleware.isCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

module.exports = router;