require ('dotenv').config();//configure env 
const express = require ('express');
const app=express();
const bodyParser= require ('body-parser');
const passport =  require ('passport');
const session = require ('express-session');
const flash = require ("express-flash");


//Use module 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'))

const dashboard = require (`${__dirname}/routes/dashboard.router.js`)// dashboard module
const rate = require (`${__dirname}/routes/exRate.router.js`)// Exchange rate module
const admin = require (`${__dirname}/routes/admin.router.js`)// admin module
const authentication = require (`${__dirname}/routes/authentication.router.js`)//authentication module
const main =  require (`${__dirname}/routes/main.router.js`)//main module
const verification =  require (`${__dirname}/routes/verification.route.js`)//main module
const promo =  require (`${__dirname}/routes/promo.route.js`)//main module


const receive = require (`${__dirname}/routes/receive.route.js`)


const PORT=process.env.PORT || 3000;//enviromental variable and port settings
 
//ask express to use session
app.use (session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}));
app.use(passport.session());//ask passport to use session
app.use(flash())

app.use(dashboard);
app.use(rate);
app.use(admin);
app.use(authentication)
app.use(main)
app.use(verification)
app.use(promo)

app.use(receive)
// app.use(authentication);

app.get('/stripe', (req, res)=>{
  res.render('stripe')
})

//404
app.use((req, res)=>{
  res.redirect('/');
})

//Start server
app.listen(PORT, ()=>{
});