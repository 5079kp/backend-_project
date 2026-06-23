import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({


title:{

type:String,

required:true

},


description:String,



status:{


type:String,


default:"pending"


},



user:{


type:mongoose.Schema.Types.ObjectId,


ref:"User"


},



category:{


type:mongoose.Schema.Types.ObjectId,


ref:"Category"


}


},{timestamps:true});



export default mongoose.model(

"Task",

taskSchema

);