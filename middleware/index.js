var Blog                  = require("../models/blog"),
	Comment 		      = require("../models/comment");
	
var middlewareObj = {};

 middlewareObj.isBlogOwnership = function (req, res, next) {
	if(req.isAuthenticated())
		{
			Blog.findById(req.params.id, function(err, foundBlog) {
				if(err) {
					res.redirect("back");
				} else {
					if(foundBlog.author.id.equals(req.user._id)) {
						next();
					} else {
						  res.redirect("back");
					};
				}
			});
		} else {
			req.flash("error", "You need to be logged in first!");
			res.redirect("back");
		}
}

middlewareObj.isCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in first!");
	res.redirect("/login");
}

module.exports = middlewareObj;