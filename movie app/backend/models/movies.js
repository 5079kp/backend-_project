import mongoose from "mongoose";

const  movieSchema  = new mongoose.Schema({

     title:{
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     image: {
          type: String,
          required: true
     },
trailerLink: {
          type: String,
          required: false
     },
     rating: {
          type: Number,
          required: true
     },
     reviews: [{text:String}]
    },{timestamps: true}  
);

export default mongoose.model("Movie", movieSchema);