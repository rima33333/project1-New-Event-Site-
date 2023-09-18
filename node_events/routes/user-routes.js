const express = require("express")
const router = express.Router()
const User = require('../models/User')
const passport =require('passport')
const multer = require("multer")
// configure multer 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/imgs')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg') 
    }
  })
  var upload = multer({ storage: storage })
//////////////////////////////////////////////////////////
//midleware to check if user is login
isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated())return next()
    res.redirect('/users/login')
}
//Login user view 
//  login user view 
router.get('/login', (req,res)=> {
    res.render('user/login', {
        error: req.flash('error')
    })
})

// login post request 
router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/users/profile',
      failureRedirect: '/users/login',
      failureFlash: true })
      )

////////////////////////////////////////////////////
//Sign up form
router.get('/signup', (req,res)=>{
    res.render('user/signup',{
        error: req.flash('error'),
         
    })

})
//Sign up post request 

router.post('/signup',  passport.authenticate('local.signup', {
   
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup',
    failureFlash: true })
    
    )



////////////////////////////
//profile 
 
 

     
 
router.get('/profile',isAuthenticated, (req, res) => {
    res.render('user/profile',{
        success: req.flash('success'),
        messages: req.flash()
    })
   
   
})
//upload user avatar

router.post('/uploadAvatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        req.flash('error', 'Please choose an image to upload.');
        return res.redirect('/users/profile');
    }

    let newFields = {
        avatar: req.file.filename
    };

    User.updateOne({ _id: req.user._id }, newFields)
        .then(() => {
            res.redirect('/users/profile');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});



// logout user

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/users/login');
    });
});

module.exports= router 