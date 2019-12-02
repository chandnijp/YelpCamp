var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

//check campground ownership checks
//1) is the user logged in at all? 
//2)if they are not then redirect to "back" (eventually we will have an error message)
//3) If they are logged in then if foundCampground.author.id.equals(req.user._id) (note.. cannot do === as one is an object and they other is a string) then we move onto next which is whatever code that follows inside the route handler(code)



middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

//check campground ownership checks
//1) is the user logged in at all? 
//2)if they are not then redirect to "back" (eventually we will have an error message: please sign in and if they do sign in and dont own it we will send a different message)
//3) If they are logged in then find the comment and if foundComment.author.id.equals(req.user._id) (note.. cannot do === as one is an object and they other is a string) then we move onto next which is whatever code that follows inside the route handler(code)



middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}




module.exports = middlewareObj