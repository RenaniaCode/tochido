const router = require("express").Router();
const Player = require('../models/Player.model');
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const League = require("../models/League.model");


router.get('/mainPlayer/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Player.findOne({'_owner':`${id}`})
        .populate('_teamOwner')
        .then((player=>{
            console.log('league id by long route',player._teamOwner._leagueOwner)
            const leagueId = player._teamOwner._leagueOwner;
            if(!player._teamOwner){
                res.render('player/main.player.hbs',{user , player , id});
            }
            else {
                League.findById(leagueId)
                .populate('_teams')
                .then((league)=>{
                    console.log('player number',player.number);
                    const data = league._teams;
                    res.render('player/main.player.hbs',{user , player , id , data});
                })
            }
        }))
        // .then((player=>{
        // res.render('player/main.player.hbs',{user , player , id});
    //}))
    })
    .catch(error=>console.log('error',error))
})

router.get('/create-player/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('player/create-player.hbs',{user});
    })
    .catch(error=>console.log('error',error))
})

router.post('/create-player/:id',(req,res,next)=>{
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
        let coach = await Team.findOneAndUpdate({_id:team_id},{$push:{'_players': player._id}})
        console.log('coach',coach._players);
    }catch(error){return error}

    
    res.redirect(`/player/mainPlayer/${id}`)
})

router.get('/edit-player/:id',(req,res,next)=>{
    const {id} = req.params

    User.findById(id)
    .then((user)=>{
        Player.find({_owner:id})
        .then((player)=>{
            console.log('player',player,'user',user)
            console.log('player name',player[0].nickname)
            res.render('player/edit-player.hbs',{player , user})
        })
    })
})

router.post('/edit-player/:id',(req,res,next)=>{
    const {id} = req.params
    const {name,surname,profile_pic , number , position , age , height , nickname} = req.body

    User.findByIdAndUpdate(id,{name,surname},{new:true})
    .then((user)=>{
        Player.findOneAndUpdate({_owner:id},{profile_pic , number , position , age , height , nickname},{new:true})
        .then(()=>res.redirect(`/player/mainPlayer/${id}`))
    })
})

module.exports = router;