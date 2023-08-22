// const express = require ("express")
const passport =  require ('passport')
const passportLocalMongoose = require ('passport-local-mongoose')

const mongoose= require ('mongoose');//mongooose database

// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
mongoose.connect("mongodb+srv://wosiwosiMoney:" + process.env.MONGO_CODE + "@wosiwosimoney.rafed39.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});


//users
const userSchema = new mongoose.Schema({
    username:"string",
    status:"boolean",
    regDate:"string",
    regTerm:"boolean",
    regAs:"string",
    profile:{
    fname:"string",
    lname:"string",    
    phone:"string",
    dob:"string",
    street:"string",
    postcode:"string",
    city:"string",
    country:"string",
    Nationality:"string"
    },
    proof:{
        sessionId:"string",
        livenessResult:"string",
        faceMatchResult:"string",
        faceMatchConfidence:"string"
    },
    cardDetails:[],
    receiver:[],
    transaction:[]  
});

//rate exchange
const rateSchema = new mongoose.Schema({
    GBPTONGN:"string",
    GBPTOGHS:"string",
    GBPTOKEN:"string",
    NGNTOGBP:"string"
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


userSchema.plugin(passportLocalMongoose)//for encrypting details

const User = new mongoose.model('User', userSchema);
const ExRate = new mongoose.model('ExRate', rateSchema);
const Transaction = new mongoose.model('Transaction', transactionScehma);
const QuickReceive = new mongoose.model('QuickReceive', quickReceiveSchema)

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//DB Update and migration
async function migrateUsers() {
    try {
  
      const users = await QuickReceive.find();
  
      // Update each user record with the new field
      for (let i=0; i<users.length; i++) {
        users[i].serviceRequest = []; // Set the initial value for the new field
        await users[i].save(); // Save the updated user record
      }
  
      console.log('Data migration completed successfully.');
      console.log(users)
  
      // Disconnect from MongoDB
      await mongoose.disconnect();
    } catch (error) {
      console.error('Data migration failed:', error);
    }
  }
  // migrateUsers();

module.exports={
    mongoose:mongoose,
    User:User,
    ExRate:ExRate,
    Transaction:Transaction,
    QuickReceive:QuickReceive
}