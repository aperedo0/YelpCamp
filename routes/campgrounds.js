var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	//res.send("YOU HIT THE POST ROUTE");
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

//NEW show for to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new")
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			//console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;