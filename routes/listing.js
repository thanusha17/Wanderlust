const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const {listingSchema,reviewSchema} = require("../schema.js");
const { isLoggedIn,isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const parser = multer({ storage: storage });

router.route("/")
.get(listingController.Index)
.post(isLoggedIn, 
    upload.single("listing[image]"),
     wrapAsync(listingController.createListing));
// .post(upload.single("listing[image.url]"), (req,res)=>{
//     res.send(req.file);
// })

//New route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderCreateForm));

router.route("/:id")
.get(wrapAsync(listingController.individualListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;