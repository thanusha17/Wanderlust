const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req,res)=>{
    try{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
     newReview.author = req.user._id;

     listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("successful");
    req.flash("success","Review added!");
    res.redirect(`/listings/${listing._id}`);
    }catch(err){
        console.log(err);
    }
}

module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
}