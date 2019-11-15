var express = require("express"),
	router  = express.Router({mergeParama: true}),
	Blog    = require("../models/blog");

var middleware = require("../middleware");
	
// INDEX route
router.get("/", function(req, res){
		Blog.find({}, function(err, blogs){
			if(err){
				console.log("ERROR!");
			} else {
				res.render("index", {blogs: blogs});
			}
		})
});

// NEW route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("new");
});

//CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			newBlog.author.id = req.user._id;
			newBlog.author.username = req.user.username;
			newBlog.save();
			res.redirect("/blogs");
		}
	});
});
		
//SHOW route
router.get("/:id", middleware.isLoggedIn, function(req, res) {
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
		if(err) {
			res.send(err);
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});


//EDIT route
router.get("/:id/edit", middleware.isBlogOwnership, function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.send("ERROR!");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE route
router.put("/:id", middleware.isBlogOwnership, function(req, res) {
	 req.body.blog.body = req.sanitize(req.body.blog.body);
	 Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
	 if(err) {
	 	res.send("ERROR!");
	 } else {
	 	res.redirect("/blogs/" + req.params.id);
	 }
	 });
 });

//DELETE route
router.delete("/:id", middleware.isBlogOwnership, function(req, res) {
	 Blog.findByIdAndRemove(req.params.id, function(err) {
	 if(err) {
	 	res.send("ERROR!");
	 } else {
	 	res.redirect("/blogs");
	 }
	 });
 });

module.exports = router;