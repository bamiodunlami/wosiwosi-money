const appRoot = require ('app-root-path');
const path = require ('path')
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath)
const db = require (appRoot+ '/model/mongodb.js')
const promoCode=db.Promo
const User=db.User
const passport = require (appRoot+ '/util/passportAuth.js')

const checkReferal = (req, res)=>{
    if(req.isAuthenticated()){
        // first check the promo code db before referal
        promoCode.findOne({code:req.body.code})
        .then(response =>{
           if(response){ //if it is available
            res.send(response)
           }else{ //if it's not available, check referal
            User.findOne({"referalCode.code":req.body.code})
            .then(response =>{
                if (response){
                    // if the user is tryin to use his/her own code
                    if(req.user.referalCode.code != req.body.code){
                        res.send({
                            codeType:"referal",
                            startDate:"noDate",
                            endDate:"noDate",
                            active:true,
                            value:3,
                            maxUse:"number"
                        }) //uses deffiernt code
                    }else{
                        res.send("false") //uses he/her own code
                    }
                }else{
                    res.send(false)
                }
            })
           }
        })
    }else{
        res.redirect('/login')
    }
}

module.exports ={
    checkReferalCode : checkReferal
}