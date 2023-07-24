const express  = require ("express");
const router = new express.Router()

// Home route
router.get('/', (req, res)=>{
    res.render('index', {
        title: "Home",
        user:req.user
    });
});

// // send today rate
// router.post('/rate', (req, res)=>{
//     console.log(req.body)
//     res.send(rate)
// });

//success
router.get('/success', (req, res)=>{
    res.render('success')
})

//success
router.get('/fail', (req, res)=>{
    res.render('fail')
})

//handle logout
router.get("/logout", function (req, res) {
    req.logout((err) => {
      if (err) {
      }
      res.redirect("/");
    });
});

module.exports=router