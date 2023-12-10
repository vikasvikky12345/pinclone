// user.js

var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts');
const passport = require('passport')
const upload = require('./multer')
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('signup', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { error: req.flash('error')});
});
router.get('/profile',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("posts")
  res.render('profile',{user});

});
router.get('/show/posts',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("posts")
  res.render('show',{user});

});
router.get('/show/posts/:postId', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
      username: req.session.passport.user
  }).populate("posts");

  const postId = req.params.postId;
  const post = user.posts.find(p => p._id == postId);

  if (!post) {
      return res.redirect('/show/posts');
  }

  res.render('imageDetails', { post });
});

router.get('/feed',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  const allposts = await postModel.find().populate('user')
  res.render('feed',{user,allposts});

});
router.get('/feed/:postId', async function(req, res, next) {
  try {
    const postId = req.params.postId;
    const post = await postModel.findById(postId).populate('user');

    if (!post) {
      return res.redirect('/feed');
    }

    res.render('feedimageDetails', { post });
  } catch (error) {
    console.error('Error retrieving post details:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/add',isLoggedIn, async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render('add',{ user: req.user });
});
router.post('/upload',isLoggedIn,upload.single('file'),async function(req,res,next){
  if(!req.file){
    return res.status(404).send("no files were available")
  }
  const user = await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile");
})
router.post('/signup', function (req, res, next) {
  const { username, email, fullname, password } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, password, function (err, user) {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Error creating user');
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/login');
      });
    }
  });
});
// user.js
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash:true
}));

router.get('/logout',function(req,res){
  req.logout(function(err){
    if(err){
      return next(err)
    } else{
      res.redirect('/')
    }
  })
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login')
}

/*router.get('/createuser', async function (req, res, next) {
  try {
    // Delete existing documents with the username 'vikas'
    await userModel.deleteMany({ username: 'vikas' });

    // Now, create the new user
    let createdUser = await userModel.create({
      username: 'vikas',
      password: '1234',
      posts: [],
      email: 'vikas@gmail.com',
      fullname: 'vikas vikky',
    });

    res.send(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});
router.get('/createpost', async function (req, res, next) {
  try {
    let userId = '655afba5247a6f37c8bbd1fb';
    
    let user = await userModel.findOne({ _id: userId });
    
    if (user) {
      let createdpost1 = await postModel.create({
        postText: 'hello everyone 1',
        user: userId,
      });
      user.posts.push(createdpost1._id);
      await user.save();

      let createdpost2 = await postModel.create({
        postText: 'hello to me 2',
        user: userId,
      });
      user.posts.push(createdpost2._id);
      await user.save();

      let createdpost3 = await postModel.create({
        postText: 'hello vikas 3',
        user: userId,
      });
      user.posts.push(createdpost3._id);
      await user.save();

      res.send('done');
    } else {
      console.log('User not found with _id:', userId);
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});

// user.js
// user.js

router.get('/alluserpost', async function (req, res, next) {
  try {
    const userId = '655afba5247a6f37c8bbd1fb'; // Replace with the correct user _id

    let user = await userModel.findOne({ _id: userId }).populate('posts');

    if (user) {
      res.send(user);
    } else {
      console.log('User not found with _id:', userId);
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user posts:', error);
    res.status(500).send('Internal Server Error');
  }
});*/




module.exports = router;
