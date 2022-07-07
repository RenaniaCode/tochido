const router = require("express").Router();
const Player = require('../models/Player.model');
const User = require("../models/User.model");
const Coach = require("../models/Team.model")


router.get('/mainPlayer/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Player.findOne({'_owner':`${id}`})
        .then((player=>{
        res.render('player/main.player.hbs',{user , player , id});
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

router.get('/mainPlayer/:id/add-team',(req,res,next)=>{
    const {id} = req.params;

    Player.findOne({_owner:id})
    .then((player)=>{
        res.render('player/addTeam.player.hbs',{player , id});
    })
})

router.post('/mainPlayer/:id/add-team', async (req,res,next)=>{
    const {id} = req.params;
    const {team_id} = req.body;
    console.log('team id', team_id)
    try{
        const player = await Player.findOneAndUpdate({_owner: id},{_teamOwner:`${team_id}`})
        let coach = await Coach.findOneAndUpdate({_id:team_id},{$push:{'_players': player._id}})
        console.log('coach',coach._players);
    }catch(error){return error}
    
    /* .then((player)=>{ 
        console.log('coach',coach)
        res.redirect(`/player/mainPlayer/${id}`)
    })
    .catch(error=>console.log('error',error)) */
    res.redirect(`/player/mainPlayer/${id}`)
})


module.exports = router;