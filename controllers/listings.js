const Listing = require("../models/listing.js");

module.exports.Index = async (req,res)=>{
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderCreateForm = async (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.individualListing = async (req,res)=>{
    let { id } = req.params;
    let info = await Listing.findById(id).populate({path:'reviews',
        populate :{
            path : 'author'
        }}).populate('owner');
    if(!info){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {info});
}

module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    let info = await Listing.findById(id);
    let previewImage = info.image.url;
    previewImage = previewImage.replace("/upload", "/upload/w_250");
    // https://res.cloudinary.com/demo/image/upload/c_fill,h_400,w_250/a_20/e_outline,co_brown/q_auto/f_auto/kitchen-island.png
    res.render("./listings/edit.ejs", { info, previewImage });
}

module.exports.updateListing = async (req,res)=>{
    let { id } = req.params;

    let newListing =  req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id,{...newListing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing was Edited!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let { id } = req.params;
    
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was Deleted!");
    res.redirect("/listings");
}