const router = require("express").Router();
const Player = require('../models/Player.model');
const User = require("../models/User.model");


router.get('/mainPlayer',(req,res,next)=>{
    res.render('player/main.player.hbs');
})

router.get('/edit-player',(req,res,next)=>{
    res.render('player/edit.player.hbs');
})

router.post('/edit-player',(req,res,next)=>{
    const { profile_pic , number , position , age , height , nickname } = req.body;

    Player.create({ profile_pic , number , position , age , height , nickname })
    .then(()=>{
        res.render('player/main.player.hbs');
    })
    .catch((error)=>console.log('error',error))
})


module.exports = router;