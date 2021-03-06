const router = require('express').Router();
const User = require('../models/Users');
// const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');

//REGiSTER
router.post('/register',async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const user = await newUser.save();
        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json(err)
    }
})
//LOGIN
router.post('/login',async(req,res)=>{
    try {
        const user = await User.findOne({username:req.body.username});
        !user&&  res.status(400).json("Wrong Caredinatials");
        const validator = await bcrypt.compare(req.body.password,user.password);
        !validator && res.status(400).json("Wrong Caredinatials");
        const {password,...info} = user._doc; 
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json(err)
        
    }
})

module.exports = router