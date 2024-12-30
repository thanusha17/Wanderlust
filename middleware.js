const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You have to Login to proceed");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
} 

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let newListing =  req.body.listing;
    // console.log(newListing);
    let listing = await Listing.findById(id);
    if(!(res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the owner of the Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(res.locals.currUser && review.author._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the owner of the Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}