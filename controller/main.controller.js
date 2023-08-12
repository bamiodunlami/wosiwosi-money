const appRoot = require ('app-root-path');
const path = require ('path')
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const mailer = require(appRoot + "/util/mailer.js")

const mongo = require(appRoot + "/model/mongodb.js"); //mongo db and strategy module
const User = mongo.User;

module.exports = (req, res)=>{
    console.log(req.query)
}
