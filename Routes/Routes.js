const Router  = require('express').Router();
const userModel = require('../Models/user');
const bcrypt = require('bcrypt');
const passport = require('passport')

const initializePassport = require('../passport-config');
initializePassport(passport);


function checkAuthenticated (req, res, next)    { req.isAuthenticated() ? next() : res.redirect('/login') ;}
function checkNotAuthenticated (req, res, next) {  !req.isAuthenticated() ? next() : res.redirect('/') ;}
 

// GET
Router.get('/login'    , checkNotAuthenticated, (req, res) => res.render("login"))   
Router.get('/register' , checkNotAuthenticated, (req, res) => res.render("register"));
Router.get('/'         , checkAuthenticated,    (req, res) => res.redirect("/home"));
Router.get('/home'     , checkAuthenticated,    (req, res) => res.render("home") );
 

// POST
Router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const {name,email,username,password}  = req.body ;
      const hashedPassword = await bcrypt.hash(password, 12)
        
        user = new userModel({
        name,    
        username,
        email,
        password: hashedPassword,
        id: Date.now().toString(),
        }); 
        
        await user.save();

      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
})
  

Router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))


// DELETE
Router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
  


module.exports.Router = Router;
module.exports.passport = passport;