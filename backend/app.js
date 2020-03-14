const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();
mongoose.connect("mongodb+srv://Ishan:" +
  process.env.MONGO_ATLAS_PW +"@cluster0-feu8n.mongodb.net/social-blog?retryWrites=true")
  .then(()=>{
    console.log("Connected to Database");
  })
  .catch(()=>{
    console.log("There was an error in connecting to the database on the cloud")
  })

app.use(bodyParser.json()); // to get body from req as req.body
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images",express.static(path.join("images")))

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin",'*');
  // the above header means that no matter which server our client runs on, it can access resources on our app server
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);
module.exports = app;
