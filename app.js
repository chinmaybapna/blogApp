var express               = require("express"),
	mongoose              = require("mongoose"),
	bodyParser            = require("body-parser"),
	methodOverride        = require("method-override"),
	expressSanitizer      = require("express-sanitizer"),
	Blog                  = require("./models/blog"),
	Comment 		      = require("./models/comment"),
	User                  = require("./models/user"),
	passport              = require("passport"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	router				  = express.Router({mergeParams:true}),
	flash				  = require("connect-flash"),
	app                   = express();

var commentRoutes = require("./routes/comments"),
	blogsRoutes   = require("./routes/blogs"),
	indexRoutes   = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Pikachu is the cutest",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
	
app.use("/blogs/:id/comments", commentRoutes);
app.use("/blogs", blogsRoutes);
app.use(indexRoutes);

  

app.listen(3000, function(){
	console.log("SERVER HAS STARTED!");
});







