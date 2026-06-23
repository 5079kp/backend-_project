import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

username:{

type:String,

required:true,

trim:true

},


email:{

type:String,

required:true,

unique:true,

lowercase:true,

trim:true

},


password:{

type:String,

required:true

},


role:{

type:String,

enum:["user","admin"],

default:"user"

},



createdTasks:[{

type:mongoose.Schema.Types.ObjectId,

ref:"Task"

}],


assignedTasks:[{

type:mongoose.Schema.Types.ObjectId,

ref:"Task"

}]


},

{

timestamps:true

}

);



const User = mongoose.model(

"User",

userSchema

);


export default User;