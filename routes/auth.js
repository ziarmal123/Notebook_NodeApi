const express =require('express')
const User =require('../models/User')
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetchuser=require('../middleware/fetchuser')
var jwt = require('jsonwebtoken');


const JWT_SECRET='12345-6789-098765'
router.post('/signin',[
    body('email','Enter Valid Email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
        ],async(req,res,next)=>{
    let Success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Success,errors: errors.array() });
    }
    const user=await User.findOne({email:req.body.email})
    if(user){
        res.statusCode=400
        res.json({Success,error:'Email ID of the request is already exisited'})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt)

    User.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email
    }).then((user)=>{
        const data={
            user:{
                id:user.id
            }
        }
         const TokenID=jwt.sign(data,JWT_SECRET)
         res.statusCode=200;
         res.setHeader('Content-Type','application/json')
         Success=true
         res.json({Success,TokenID});
        },(err)=>next(err))
        .catch((err)=>next(err))
})
router.post('/login',[
    body('email','Enter Valid Email').isEmail(),
    body('password','Password Should Not Null').exists(),
    ],async(req,res,next)=>{
    let Success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Success,errors: errors.array() });
    }
    const {email,password}=req.body;
    User.findOne({email}).then(async(user)=>{
    if(!user){
            return res.status(400).json({Success,error:"Please Enter Corect Data"})
        }
    const passwordComapre=await bcrypt.compare(password,user.password);
        if(!passwordComapre){
            return res.status(400).json({error:"Please Enter Corect Data"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        Success=true
        const TokenID=jwt.sign(data,JWT_SECRET)
        res.json({Success,TokenID})
    })
    
}

)
router.post('/token',fetchuser,async(req,res,next)=>{
try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user)
    
} catch (error) {
    console.err(error.message)
    res.status(500).send("Server Error Kindly Check")
}
        })


// router.get('/',(req,res,next)=>{
//     User.find({})
//     .then((user)=>{
//      res.statusCode=200;
//      res.setHeader('Content-Type','application/json')
//      res.json(user);
//     },(err)=>next(err))
//     .catch((err)=>next(err))
// })

// router.post('/',(req,res,next)=>{
//     User.create(req.body)
//     .then((user)=>{
//      console.log("New User Created",user);
//      res.statusCode=200;
//      res.setHeader('Content-Type','application/json')
//      res.json(user);
//     },(err)=>next(err))
//     .catch((err)=>next(err))
// })


module.exports= router