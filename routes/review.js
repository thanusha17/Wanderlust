const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//Add Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

//Delete Reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;