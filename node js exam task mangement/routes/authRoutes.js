import express from "express";


import {

    registerUser,

    loginUser,

    logoutUser

} from "../controllers/authController.js";



const router = express.Router();



// ===============================
// PAGES ROUTES
// ===============================


// HOME PAGE

router.get("/", (req,res)=>{

    res.redirect("/login");

});



// REGISTER PAGE

router.get("/register", (req,res)=>{


    res.render("register");


});



// LOGIN PAGE

router.get("/login", (req,res)=>{


    res.render("login");


});




// ===============================
// ACTION ROUTES
// ===============================


// REGISTER USER

router.post("/register", registerUser);



// LOGIN USER

router.post("/login", loginUser);



// LOGOUT USER

router.get("/logout", logoutUser);




export default router;