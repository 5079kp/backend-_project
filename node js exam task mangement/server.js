import express from "express";

import mongoose from "mongoose";

import cookieParser from "cookie-parser";

import dotenv from "dotenv";


import authRoutes from "./routes/authRoutes.js";

import taskRoutes from "./routes/taskRoutes.js";



dotenv.config();



const app = express();


const PORT = process.env.PORT || 8000;



// middleware


app.use(express.urlencoded({

extended:true

}));


app.use(express.json());


app.use(cookieParser());


app.use(express.static("public"));



// ejs


app.set(

"view engine",

"ejs"

);



// routes


app.use(

"/",

authRoutes

);


app.use(

"/tasks",

taskRoutes

);




// database


mongoose.connect(

process.env.MONGO_URL

)

.then(()=>{


console.log("MongoDB Connected");


})


.catch((error)=>{


console.log(error);


});




// server


app.listen(PORT,()=>{


console.log(

`Server Running http://localhost:${PORT}`

);


});