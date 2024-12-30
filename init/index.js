const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const newData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

let initData = async ()=>{
    await Listing.deleteMany({});
    newData.data = newData.data.map((obj)=>({...obj,owner:"676ce3f82d2462a0bc5cdfbf"}));
    await Listing.insertMany(newData.data);
    // await Listing.findByIdAndUpdate()
    console.log("Data was initialized");
}

initData();

