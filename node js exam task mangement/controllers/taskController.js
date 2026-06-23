import Task from "../models/Task.js";

import User from "../models/User.js";



// SHOW TASKS


export const getTasks = async(req,res)=>{


try{


let tasks;



// Admin all task access

if(req.user.role==="admin"){


tasks = await Task.find()

.populate("user")

.populate("category");


}


// normal user

else{


tasks = await Task.find({

user:req.user.id


})

.populate("category");


}



res.render("taskList",{

tasks,

user:req.user


});



}

catch(error){


console.log(error);


}


};





// FORM PAGE


export const taskForm =

(req,res)=>{


res.render("taskForm");


};




// ADD TASK


export const addTask = async(req,res)=>{


try{


const task = await Task.create({


title:req.body.title,


description:req.body.description,


user:req.user.id


});



// add task reference in user


await User.findByIdAndUpdate(


req.user.id,


{


$push:{tasks:task._id}


}


);



res.redirect("/tasks");


}

catch(error){


console.log(error);


}


};






// DELETE TASK


export const deleteTask = async(req,res)=>{


try{



const task = await Task.findById(

req.params.id

);




// user security

if(

req.user.role !== "admin"

&&

task.user.toString()

!== req.user.id

){


return res.send(

"Not Allowed"

);


}




await Task.findByIdAndDelete(

req.params.id

);



res.redirect("/tasks");



}

catch(error){


console.log(error);


}



};






// UPDATE TASK


export const updateTask = async(req,res)=>{


try{


await Task.findByIdAndUpdate(

req.params.id,


{


title:req.body.title,


description:req.body.description


}

);



res.redirect("/tasks");


}

catch(error){


console.log(error);


}


};