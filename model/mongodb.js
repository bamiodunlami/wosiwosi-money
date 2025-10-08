// const express = require ("express")
const passport =  require ('passport')
const passportLocalMongoose = require ('passport-local-mongoose')

const mongoose= require ('mongoose');//mongooose database

// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
// mongoose.connect("mongodb+srv://wosiwosiMoney:" + process.env.MONGO_CODE + "@wosiwosimoney.rafed39.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});
mongoose.connect('mongodb+srv://wosiwosiMoney:' + process.env.MONGO_CODE + '@wosiwosimoney.rafed39.mongodb.net/?retryWrites=true&w=majority&appName=wosiwosiMoney', {useNewUrlParser:true})
// mongoose.connect('mongodb://wosiwosiMoney:'+process.env.MONGO_CODE+'@ac-xxbpizw-shard-00-00.rafed39.mongodb.net:27017,ac-xxbpizw-shard-00-01.rafed39.mongodb.net:27017,ac-xxbpizw-shard-00-02.rafed39.mongodb.net:27017/?ssl=true&replicaSet=atlas-2diny9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=wosiwosiMoney')


//users
const userSchema = new mongoose.Schema({
    username:String,
    userId:String,
    status:"boolean",
    regDate:String,
    regTerm:"boolean",
    regAs:String,
    profile:{
    fname:{type:String, trim:true},
    lname:{type:String, trim:true},    
    phone:{type:String, trim:true},
    dob:String,
    street:String,
    postcode:String,
    city:String,
    country:String,
    Nationality:{type:String, trim:true}
    },
    proof:{
        sessionId:String,
        livenessResult:String,
        faceMatchResult:String,
        faceMatchConfidence:String
    },
    cardDetails:[],
    receiver:[],
    transaction:[],
    resetLink:String,
    verifyMail:"boolean",
    referalCode:{
      code:String,
      usage:[]
    },
    promo:[],
    identity:{
      bvn:String,
      bvnVerify:"Boolean",
      pass:String,
      pAddress:String
    },
    receiveRequest:[]
});

//rate exchange
const rateSchema = new mongoose.Schema({
    GBPTONGN:String,
    GBPTOGHS:String,
    GBPTOKEN:String,
    NGNTOGBP:String
});

//hold all transaction
const transactionScehma = new mongoose.Schema({
details:[]
});

const quickReceiveSchema = mongoose.Schema({
  fname: 'string',
  lname: 'string',
  address: 'string',
  postcode: 'string',
  phone: 'string',
  email: 'string',
  ukBank: 'string',
  ukaccount: 'string',
  sortCode: 'string',
  nameOnAccount: 'string',
  description: 'string',
  bvn: 'string',
  docLink_1:'string',
  dockLink_2:'string'
});

// promo
const promoSchema = mongoose.Schema({
  codeType:String,
  code:String,
  startDate:"Date",
  endDate:"Date",
  active:"Boolean",
  value:"number",
  maxUse:"number"
})


userSchema.plugin(passportLocalMongoose)//for encrypting details

const User = new mongoose.model('User', userSchema);
const ExRate = new mongoose.model('ExRate', rateSchema);
const Transaction = new mongoose.model('Transaction', transactionScehma);
const QuickReceive = new mongoose.model('QuickReceive', quickReceiveSchema);
const Promo = new mongoose.model('Promo', promoSchema)

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//DB Update and migration
async function migrateUsers() {
    try {
  
      // const savePromo = new Promo({
      //   codeType:"promo",
      //   code:"firsUse",
      //   startDate:"",
      //   endDate:"",
      //   active:true,
      //   value:5,
      //   maxUse:1
      // })

      // savePromo.save()
      const users = await User.find();
  
      // Update each user record with the new field
      for (let i=0; i<users.length; i++) {
        users[i].userId = Math.floor(Math.random() * 9e10)
        await users[i].save(); // Save the updated user record
      }
  
      console.log('Data migration completed successfully.');
      console.log(users);
  
      // Disconnect from MongoDB
      await mongoose.disconnect();
    } catch (error) {
      console.error('Data migration failed:', error);
    }
  }
  // migrateUsers();


  async function getAdmin(){
    const admin = await User.find({regAs:"admin"})
    console.log(admin)
  }

  // getAdmin()

module.exports={
    mongoose:mongoose,
    User:User,
    ExRate:ExRate,
    Transaction:Transaction,
    QuickReceive:QuickReceive,
    Promo:Promo
}