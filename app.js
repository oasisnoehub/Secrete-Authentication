//jshint esversion:6
const express = require("express");
const bodyParer = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParer.urlencoded({
  extended: true
}));

//=============Mongoose===============
const dbUrl = "mongodb://localhost:27017/userDB"
mongoose.connect(dbUrl,{useNewUrlParser:true});

const userSchema = {
  email: String,
  password : String
};

const User = mongoose.model("User",userSchema);

//============Req & Res===============
app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login",{loginResult:""});
});

app.post("/login",function(req,res){
  const userName = req.body.username;
  const userPassword = req.body.password;
  User.findOne({
    email:userName,
    password:userPassword
  },function(err,foundUser){
    if (!err) {
      if (!foundUser) {
        res.render("login",{loginResult:"Don't have such account.Please try again! Or registe an account."});
      }else{
        res.render("secrets",{loginResult:"successful"});
      }
    }
  });

});

app.get("/register",function(req,res){
  res.render("register",{registedResult:""});
});

app.post("/register",function(req,res){
  const userName = req.body.username;
  const userPassword = req.body.password;

  User.findOne({
    email:userName,
    password:userPassword
  },function(err,foundUser){
    if (!err) {
      console.log(foundUser);
      if (!foundUser) {
        const user = new User({
          email:userName,
          password:userPassword
        });
        user.save(function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Registed Account!");
            res.render("secrets");
          }
        });
      }else{
        console.log("Already have account!");
        res.render("register",{registedResult:"Note: Already have the account! Please directly login."});
    }
  }else{
    console.log(err);
  }
  });
});




//==================Listen port ===========
app.listen(3000,function(err){
  if(!err){
    console.log("Server is running!");
  }else{
    console.log(err);
  }
});