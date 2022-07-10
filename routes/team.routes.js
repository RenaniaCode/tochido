const router = require("express").Router();
const Team = require('../models/Team.model');
const User = require('../models/User.model');
const Player = require('../models/Player.model')

router.get('/mainTeam/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Team.findOne({'_owner':`${id}`})
        .populate('_players _owner')
        .then((coach=>{
        console.log('coach',coach._players);
        let numPlayers = coach._players.length;
        res.render('team/main-team',{user , coach , id , numPlayers});
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
    Team.create({ team_name , team_logo , _owner:id })
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

    Team.find({_owner:id})
    .populate('_players _owner')
    .then((team)=>{
        const show = team[0];
        console.log('id players',show._players.length) 
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
        let team = await Team.findOneAndUpdate({_owner:id},{$push:{'_players': player_id}})
        let player = await Player.findByIdAndUpdate(player_id,{_teamOwner:team._id})
    }catch(error){return error}

    res.redirect(`/team/mainTeam/${id}`)

})

router.get('/mainTeam/delete/:_id',(req,res,next)=>{
    const {_id} = req.params;

    Player.findById(_id)
    .then(player=>{
        console.log('player team owner',player._teamOwner)
        Team.findByIdAndUpdate(player._teamOwner,{$pull:{_players:_id}})
        .then((team)=>{
            console.log('team id',team._id)
            Player.findByIdAndUpdate(_id,{_teamOwner:null})
            .then(()=>{
                res.redirect(`/team/mainTeam/${team._owner}`)
            })
        })
    })
    .catch(error=>console.log('error',error))
})

router.get('/mainTeam/:id/lineup', (req,res,next)=>{
    const {id} = req.params;
    Team.find({_owner:id})
    .populate('_owner _players')
    .then((team)=>{res.render('team/lineups-team.hbs',team , id)})
})

module.exports = router;