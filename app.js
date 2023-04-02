const express  = require('express');
const session  = require('express-session');
const DBsession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const flash = require('express-flash')
const methodOverride = require('method-override')
const Router = require('./Routes/Routes').Router;
const passport = require('./Routes/Routes').passport;
const app	= express();


const DBuri = "mongodb://127.0.0.1:27017/App";// Ex: mongodb://127.0.0.1:27017/DB_Name

mongoose.connect(DBuri,{
    useNewUrlParser: true,
    useCreateIndex: true ,
    useUnifiedTopology: true
}).then(() => console.log("Mongodb Connected"))

const store = new DBsession({uri:DBuri , collection: "sessions"}) 

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true}));
app.use(flash())
app.use(session({
    secret:"SECRET",
    resave: false,
    saveUninitialized: false,
    store: store ,//
    cookie:{maxAge:  1000 * 60 * 60 * 24} // 24h 
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(Router);

app.listen(3000, () => console.log("Listening on port 3000"));