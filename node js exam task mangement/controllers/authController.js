import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";



// REGISTER USER


export const registerUser = async(req,res)=>{


try{


const {

username,

email,

password,

role

}=req.body;



console.log(req.body); // CHECK DATA COMING OR NOT



// check fields

if(!username || !email || !password){


return res.send(

"All Fields Required"

);


}




// check user exists

const existUser = await User.findOne({

email:email

});



if(existUser){


return res.send(

"User Already Exists"

);


}



// password hash


const hashPassword = await bcrypt.hash(

password,

10

);




// create user


await User.create({


username:username,

email:email,

password:hashPassword,

role:role || "user"


});



res.redirect("/login");



}

catch(error){


console.log("REGISTER ERROR:",error);


res.status(500).send(

"Something went wrong in Register: " + (error && error.message ? error.message : error)

);


}


};




// LOGIN USER


export const loginUser = async(req,res)=>{


try{


const {

email,

password

}=req.body;



const user = await User.findOne({

email

});



if(!user){


return res.send("User Not Found");


}



const matchPassword = await bcrypt.compare(

password,

user.password

);



if(!matchPassword){


return res.send("Wrong Password");


}



const token = jwt.sign(

{

id:user._id,

role:user.role

},

process.env.JWT_SECRET,

{

expiresIn:"1d"

}

);



res.cookie(

"token",

token

);



res.redirect("/tasks");



}

catch(error){


console.log(error);


res.send("Login Error");


}


};




// LOGOUT


export const logoutUser=(req,res)=>{


res.clearCookie("token");


res.redirect("/login");


};