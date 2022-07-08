const router = require("express").Router();
const Coach = require('../models/Team.model');
const User = require('../models/User.model');
const Player = require('../models/Player.model')

router.get('/mainTeam/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Coach.findOne({'_owner':`${id}`})
        .populate('_players')
        .then((coach=>{
        /* console.log('players',coach._players);
        console.log('coach',coach); */
        res.render('team/main-team',{user , coach , id});
    }))
    })
    .catch(error=>console.log('error',error))
})

router.get('/edit-team/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('team/edit-team',{user});
    })
    .catch(error=>console.log('error',error))
})

router.post('/edit-team/:id',(req,res,next)=>{
    const { team_name , team_logo } = req.body;
    const { id } = req.params
    console.log('name y logo',id , team_name , team_logo)
    Coach.create({ team_name , team_logo , _owner:id })
    .then(()=>{
        console.log('id',id)
        User.findById(id)
        .then((user)=>{
            console.log('Owner',user)
            res.redirect(`/team/mainTeam/${user._id}`);
        })
    })
    .catch(error=>console.log('error',error))
})

router.get('/mainTeam/:id/add-players',(req,res,next)=>{
    const {id} = req.params;

    Coach.find({_owner:id})
    .populate('_players _owner')
    .then((team)=>{
        const show = team[0];
        console.log('team get',show._players) 
            const numPlayer = show._players.length
            res.render('team/addPlayers-team.hbs',{ id , show , numPlayer });
    })
    .catch(error=>console.log('error',error))

})

router.post('/mainTeam/:id/add-players', async (req,res,next)=>{
    
    const {id} = req.params;
    const {player_id} = req.body;
    console.log('player id', player_id)
    try{
        let team = await Coach.findOneAndUpdate({_owner:id},{$push:{'_players': player_id}})
        let player = await Player.findByIdAndUpdate(player_id,{_teamOwner:team._id})
    }catch(error){return error}
    
    res.redirect(`/team/mainTeam/${id}`)

})

module.exports = router;