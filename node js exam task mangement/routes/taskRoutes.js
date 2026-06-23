import express from "express";


import {


getTasks,

addTask,

deleteTask,

updateTask,

taskForm


} from "../controllers/taskController.js";


import {

authMiddleware

}

from "../middleware/authMiddleware.js";




const router = express.Router();




// all protected


router.use(authMiddleware);




router.get(

"/",

getTasks

);



router.get(

"/add",

taskForm

);



router.post(

"/add",

addTask

);



router.post(

"/delete/:id",

deleteTask

);



router.post(

"/update/:id",

updateTask

);




export default router;