
const Post = require("../models/posts");

exports.createPost =  (req,res,next)=>{
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  }); // creates a javascript like object but with the definition of our post-model schema

  post.save().then(createdPost=>{
    res.status(201).json({
      message:"Post Added Successfully!",
      post : {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    }) // new resource was created
  })
  .catch(error=>{
    res.status(500).json({
      message:"Creating a post failed."
    })
  }); //saves the 'post' object as a document in the 'posts' collection
}

exports.updatePost = (req,res,next)=>{
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id:req.params.id, creator: req.userData.userId},post).then(result=>{
    if(result.n > 0){
      res.status(200).json(
        {message:"Update Successful"});
    } else {
      res.status(401).json(
        {message:"Not Authorized!"});
    }
  })
  .catch(error=>{
    res.status(500).json({
      message:"Could not update post!"
    })
  })
}

exports.getPosts = (req, res, next)=>{
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQeury = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage){
    postQeury
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQeury
    .then(documents =>{
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched Successfully!",
        posts: fetchedPosts,
        maxPosts:count
      })
    })
    .catch(error=>{
      res.status(500).json({
        message:"Fetching Posts Failed"
      })
    });
}

exports.getPost = (req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({
        message:"Post Not Found"
      })
    }
  })
  .catch(error=>{
    res.status(500).json({
      message:"Fetching Post Failed"
    })
  });
}

exports.deletePost = (req,res,next)=>{
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
    if(result.n>0){
      res.status(200).json(
        {message:"Deletion Successful"});
    } else {
      res.status(401).json(
        {message:"Not Authorized!"});
    }
  })
  .catch(error=>{
    res.status(500).json({
      message:"Deleting Post Failed"
    })
  });
}
