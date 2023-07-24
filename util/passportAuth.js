
const express = require ('express')
const app= express();
const passport = require ('passport')

app.use(passport.initialize()); //initialize passport

module.exports=passport