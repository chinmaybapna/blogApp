var express  = require("express"),
	router  = express.Router(),
	passport = require("passport"),
	User     = require("../models/user");

//AUTH route

//REGISTER
router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req,res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to MyBlog " + req.user.username);
			res.redirect("/blogs");
		});
	});
});

//LOGIN
router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req, res) {
	
});

//LOGOUT
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged out!")
	res.redirect("/blogs");
})

module.exports = router;
