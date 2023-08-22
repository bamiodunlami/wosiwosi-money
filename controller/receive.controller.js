const appRoot = require ('app-root-path');
const path = require ('path');
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const passport = require(appRoot + '/util/passportAuth.js')
const model =  require(appRoot + '/model/mongodb.js')
const newQReceive = model.QuickReceive
const mailer =  require (appRoot + '/util/mailer.js')

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
    const newQucikReceive = new newQReceive({
        fname: req.body.fname,
        lname: req.body.lname,
        address: req.body.address,
        postcode: req.body.postcode,
        phone: req.body.phone,
        email: req.body.email,
        ukBank: req.body.ukBank,
        ukaccount: req.body.ukaccount,
        sortCode: req.body.sortCode,
        nameOnAccount: req.body.nameOnAccount,
        description: req.body.description,
        bvn: req.body.bvn,
        docLink_1:'link1',
        dockLink_2:'link2'
    })
    newQucikReceive.save()
    .then((response) =>{
        mailer.quickReceive(req.body.email, req.body.fname)
        mailer.adminQuickReceive("seyiawo@wosiwosi.co.uk", req.body.fname, req.body.fname, req.body.lname, req.body.address, req.body.postcode, req.body.phone, req.body.email, req.body.ukBank, req.body.ukaccount, req.body.sortCode, req.body.nameOnAccount, req.body.description, req.body.bvn, "wosiwosi.co.uk")
        res.render('success')
    })
};

module.exports={
    receivePage :  renderReceive,
    request : receiveRequest,
    quickReceive:qreceive,
    quickReceiveRequest:qreceiveRequest
}