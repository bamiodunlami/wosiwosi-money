const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const mongo =require (appRoot + `/util/mongodb.js`);//mongo db and strategy module
const Rate = mongo.ExRate
// const Transaction = mongo.Transaction

    const exrates= new Rate({
            GBPTONGN:"1103",
            GBPTOGHS:"60",
            GBPTOKEN:"110",
    });

    // const trans =  new Transaction({
    //     details:[]
    // })

  const exRate=  (req, res)=>{
        Rate.find({})
        .then((response) =>{
            res.send(response)
        })    
        // exrates.save();
        // trans.save();
    }

module.exports ={
    exchangeRate : exRate
}