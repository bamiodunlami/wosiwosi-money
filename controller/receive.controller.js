const appRoot = require ('app-root-path');
const path = require ('path');
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const passport = require(appRoot + '/util/passportAuth.js')

const renderReceive = (req, res)=>{
    if(req.isAuthenticated()){
        res.render('receive', {
            title: "Receive",
            user: req.user
        })
    }else{
        res.redirect('/login')
    }
}

const receiveRequest = (req, res)=>{
    console.log(req.body)
};

const qreceive = (req, res)=>{
        res.render('ngntogbpform', {
            title: "Quick Receive",
            user: req.user
        })
}

const qreceiveRequest = (req, res)=>{
    console.log(req.body)
};

module.exports={
    receivePage :  renderReceive,
    request : receiveRequest,
    quickReceive:qreceive,
    quickReceiveRequest:qreceiveRequest
}