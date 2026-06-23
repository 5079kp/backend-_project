export const adminOnly =

(req,res,next)=>{


if(req.user.role !== "admin"){


return res.send(

"Access Denied Only Admin"

);


}


next();


};