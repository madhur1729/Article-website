var express  = require("express");
    expressSanitizer = require("express-sanitizer");
    mongoose = require("mongoose")
    express  = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override")
    app      = express();

// app config
mongoose.connect("mongodb://localhost/blogapp",{ useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer())
app.use(methodOverride("_method"));


//Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image : String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "test blog",
//     image: "https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Hello this a blog post"
// });

// Rest ful routes

app.get("/",function(req ,res){
    res.redirect("/blogs");
})


app.get("/blogs",function(req,res){
    Blog.find({},function (err,blogs) {
        if(err){console.log(err);}
        else {
            res.render("index",{blogs:blogs});
        }
    });
});


//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});


//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){res.render("/blogs");}
        else
        res.redirect("/blogs");
    });
});

//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }else {
            res.render("show",{blog:foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit" , function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog :foundBlog});
        }
    });
});

// Updaate route

app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err,updatedblog){
        if(err){
            res.redirect("index");
        } else{
            res.redirect("/blogs/" + req.params.id)
        }
    })
})


// delete route
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(3000,function(){
    console.log("server started");
})