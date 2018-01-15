var mongoose = require('../passport/mongoose');
//var mongoose=require("mongoose");
var express=require('express');
const user=require('../passport/user')
var bodyParser=require('body-parser');
var passport = require('passport');
let flash=require('connect-flash');
const bcrypt=require('bcryptjs');
const session=require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var app=express();
app.set("view engine", "ejs");
app.set(__dirname+'/views');
app.use(flash());
//app.use('view engine','ejs');
//app.use(app.router);
app.use(session({secret:'test'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(req.url=='/login' || req.url=='/logout' || req.url=='/signup'){
        next();
    }else{
        if(req.session.passport){
            if(Object.keys(req.session.passport).length!=0) {
                next();
            }
            else{
                console.log("ede3d");
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
        }
    }
});
// app.use(
// function sessionChecker(req, res, next) {
//     if (req.session.username) {
//         next();
//     } else {
//         res.redirect("/login");
//     }
// });

/**
 * add schema
 */
//var url = 'mongodb://localhost:27017/myproject';

//mongoose.connect(url);
//var UserDetails=new user()

app.get('/login', function(req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  //  res.render('login.ejs', { message: req.flash('loginMessage') });
    //res.sendFile(__dirname+'/views/login.ejs');
    res.render('login',{ message: req.flash('loginMessage') });
});
/**
 * Registration Process
 */
app.get('/signup', function(req, res) {
    //res.render('signup.ejs', { message: req.flash('signupMessage') });
    res.render('signup', { message: req.flash('signupMessage') });
    //res.render('views/signup.ejs');
});

/**
 * login handle route
 */
app.post('/login',
    passport.authenticate('local',{
        successRedirect:'/loginSuccess',
        failureRedirect:'/loginFailure'
    })
);
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/home',
    failureRedirect : '/signup',
    failureFlash : true
}));

app.get('/loginFailure',function(req, res, next) {

    res.send('Failed to authenticate');
});
app.get('/viewdetail',function(req, res, next) {

    res.send('viewdetail',{uesr:req.user});
});
app.get('/loginSuccess', function(req, res, next) {
    console.log(req.session);

   // res.send('Successfully authenticated');
    res.render('home',{user:req.user});
});

app.get('/logout',(req,res)=>{

    req.logout();
   /// req.session().destroy()
    console.log(req.session.passport);
    res.redirect('/login');
});

/**
 * serialize and deserialise user instance
 *
 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new LocalStrategy(function(username, password, done) {
    console.log('adsf');
    console.log("username"+username);
    console.log("password"+password);
   // user.find().then((res)=>{console.log(res)});
   //  user.find({'username':username,'password':password},(err,res)=>{
   //      if(err) throw err;
   //      console.log(res);
   //  });
    process.nextTick(function() {
        user.findOne({

            'username': username,
        }, function(err, user) {
            if (err) {

                return done(err);
            }

            if (!user) {
              //  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
               // return done(null, false);
                return done("user not found",false);
            }
            bcrypt.compare(password,user.password,(err,res)=>{
                            console.log(res);
                            if (res){
                                return done(null, user);
                            }
                            return done(null,false);
            });
            console.log(user.password);
            console.log(user.username);
            console.log(user);
            //return done(null,false);
        });
   });
}));

passport.use('local-signup',new LocalStrategy({
       usernameField:'username',
        passwordField:'password',
    passReqToCallback:true
},(req,username,password,done)=>
{
           process.nextTick(()=>
           {
               user.findOne({'username': username},(err,userr)=>
               {
                   if (err)
                       return done(err);

                   if (userr)
                   {
                       return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                   }
                   else
                   {
                       console.log("enter")
                       let newUser  = new user();

                       newUser.username   = username;
                       newUser.password = newUser.generateHash(password);

                       console.log("Username : " ,username)
                       console.log("Password : " ,password)

                       newUser.save((err) => {
                           if(err)
                               return console.log(err)
                           return console.log(newUser)
                       });
                   }
                   });
           });
}));
app.listen(8000,()=>{
    console.log(`started on port 8000`);
})
