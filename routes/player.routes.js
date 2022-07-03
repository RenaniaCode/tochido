const router = require("express").Router();
const Player = require('../models/Player.model');
const User = require("../models/User.model");


router.get('/mainPlayer/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Player.findOne({'_owner':`${id}`})
        .then((player=>{
        res.render('player/main.player.hbs',{user , player});
    }))
    })
    .catch(error=>console.log('error',error))
})

router.get('/edit-player/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('player/edit.player.hbs',{user});
    })
    .catch(error=>console.log('error',error))
})

router.post('/edit-player/:id',(req,res,next)=>{
    const { profile_pic , number , position , age , height , nickname } = req.body;
    const { id } = req.params;

    Player.create({ profile_pic , number , position , age , height , nickname , _owner: id})
    .then(()=>{
        console.log('id',id)
        User.findById(id)
        .then((user)=>{
            console.log('Owner',user)
            res.redirect(`/player/mainPlayer/${user._id}`);
        })
    })
    .catch(error=>console.log('error',error))
})


module.exports = router;