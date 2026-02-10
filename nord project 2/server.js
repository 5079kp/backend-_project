const express = require ("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))

let todos = [
    {id:1, text:"🔥 Learn Node.js Basics" },
    {id:2, text:"🚀 Build Express Project" },
    {id:3, text:"🎨 Practice Gsap Animation" },
    {id:4, text:"💻create best UI" },
    

]
//home

app.get("/",(req,res)=>{
    res.render("index", {todos});
});

//add

app.post("/add", (req, res)=>{
    todos.push({
        id: Date.now(),
        text:req.body.todo
    })
        res.redirect("/");

});

//delete

app.get("/delete/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== id);
    res.redirect("/");
});

//update
app.post("/update/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (todo){
        todo.text = req.body.todo
    }
    res.redirect("/");
});

app.listen(5000,()=>{
    console.log("server running http://localhost:5000")
})

