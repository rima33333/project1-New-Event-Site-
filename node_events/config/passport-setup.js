const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/User');

// Saving user object in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
//////////////////////////////////////////////////////////////
// Helper function to validate email format
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
};

// Helper function to validate password
// Helper function to validate password
const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return re.test(password);
};

///////////////////////////////////////////////////////////////

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        if (!validateEmail(username)) {
            return done(null, false, req.flash('error', 'Invalid email format.'));
        }

        if (req.body.password !== req.body.confirm_password) {
            return done(null, false, req.flash('error', 'Password does not match'));
        }

        if (!validatePassword(password)) {
            return done(null, false, req.flash('error', 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number.'));
        }

        const existingUser = await User.findOne({ email: username });
        if (existingUser) {
            return done(null, false, req.flash('error', 'Email already used'));
            
        }
    
        const newUser = new User();
        newUser.email = req.body.email;
        newUser.password = newUser.hashPassword(req.body.password),
        newUser.avatar ="g3.jpg"
      
        const savedUser = await newUser.save();
         
         req.flash('success','added user')
       return done(null,savedUser)
 
        

    } catch (err) {
        console.error(err);
        return done(null, false, req.flash('error', 'An error occurred.'))
    }
}));
//login strattegy 
passport.use('local.login', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        let user = await User.findOne({ email: username });

        if (!user) {
            return done(null, false, req.flash('error', 'user was not found'));
        } 
        
        if (user.comparePasswords(password, user.password)) {
            return done(null, user, req.flash('success', 'welcome back'));
        } else {
            return done(null, false, req.flash('error', 'password is wrong'));
        }

    } catch (err) {
        console.log(err);
        return done(null, false, req.flash('error', 'Something wrong happened'));
    }
}));

 