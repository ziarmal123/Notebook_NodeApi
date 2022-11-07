const express =require('express')
const router=express.Router();
const fetchuser=require('../middleware/fetchuser')
const Notes =require('../models/Notes')
const {body, validationResult} = require('express-validator');



router.get('/getnotes',fetchuser,async(req,res,next)=>{
    
    Notes.find({user:req.user.id})
    .then((notes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(notes)

    },(err)=>next(err))
    .catch((err)=>{next(err)})
})

router.post('/addnotes',fetchuser,[
    body('title','Should be Minimum 3 Character').isLength({ min: 3 }),
    body('description','Should be More than 5 character').isLength({ min: 5 }),
        ],async(req,res,next)=>{
     const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
         }
    const {title,description,tag}=req.body
    Notes.create({user:req.user.id,title:title,description:description,tag:tag}).
    then((notes)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json')
    res.json(notes)
    },(err)=>next(err))
    .catch((err)=>{next(err)})
})
router.put('/updatenotes/:id',fetchuser,(req,res,next)=>{
    Notes.findById(req.params.id).
    then((notes)=>{
        if(!notes){
            res.status(400)
            res.send('Notes not Found')
        }
        if(notes.user.toString()!==req.user.id){
            res.status(400)
            res.send('Not Allowed')
        }
    },(err)=>next(err))
    .catch((err=>next(err)))
    Notes.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    .then((notes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(notes)
    },(err)=>next(err))
    .catch((err=>(next(err))))
})
router.delete('/deletenote/:id',fetchuser,(req,res,next)=>{
    Notes.findById(req.params.id).
    then((notes)=>{
        if(!notes){
            res.status(400)
            res.send('Notes not Found')
        }
        if(notes.user.toString()!==req.user.id){
            res.status(400)
            res.send('Not Allowed')
        }
        },(err)=>next(err))
        .catch((err)=>next(err))
        Notes.findByIdAndDelete(req.params.id)
        .then((notes)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json({"Success":"Data had Been Deleted",notes:notes})
        },(err)=>next(err))
        .catch((err=>(next(err))))
        })



  



module.exports=router;