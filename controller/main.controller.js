const appRoot = require ('app-root-path');
const path = require ('path')
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const mailer = require(appRoot + "/util/mailer.js")

const mongo = require(appRoot + "/model/mongodb.js"); //mongo db and strategy module
const User = mongo.User;

const home = (req, res)=>{
    res.render('index', {
        title: "Wosiwosi Money | Fast, secured and good rate",
        user:req.user
    });
}

const rate = (req, res)=>{
    console.log(req)
    res.send()
}

const privacy = (req, res)=>{
    res.render('privacy', {
        title: "Pricacy Policy",
        user:req.user
    })
}

const term = (req, res)=>{
    res.render('terms', {
        title: "Terms of use",
        user:req.user
    })
}

const contact = (req, res)=>{
    res.render('contact', {
        title: "Contact",
        user:req.user
    })
}


module.exports ={
    rate:rate,
    home:home,
    privacy:privacy,
    term:term,
    contact:contact
}
