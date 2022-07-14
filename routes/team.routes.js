const router = require("express").Router();
const Team = require('../models/Team.model');
const User = require('../models/User.model');
const Player = require('../models/Player.model');
const League = require('../models/League.model');
const isLoggedIn = require("../middleware/isLoggedIn");

router.get('/mainTeam/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Team.findOne({'_owner':`${id}`})
        .populate('_players _owner _leagueOwner')
        .then((coach=>{
            if(!coach._leagueOwner){
                console.log('coach',coach._players);
                const numPlayers = coach._players.length;
                res.render('team/main-team',{user , coach , id , numPlayers});
            }
            else {
                League.findById(coach._leagueOwner)
                .populate('_teams _warning _matches')
                .then((league)=>{
                    console.log('data',league._warning);
                    const data = league._teams;
                    const numPlayers = coach._players.length;
                    const sorted = data.filter((team)=>team.points).sort((a,b)=>b.points-a.points)
                    res.render('team/main-team',{user , coach , id , numPlayers , data , league , sorted});
                })
            }
        }))
    })
    .catch(error=>console.log('error',error))
})

router.get('/create-team/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('team/create-team',{user});
    })
    .catch(error=>console.log('error',error))
})

router.post('/create-team/:id',(req,res,next)=>{
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
    .then((team)=>{
        console.log('team',team)
        res.render('team/lineups-team',{team , id})
    })
    .catch(error=>console.log('error',error))
})

router.get('/edit-team/:id',(req,res,next)=>{
    const {id} = req.params

    User.findById(id)
    .then((user)=>{
        Team.find({_owner:id})
        .then((team)=>{
            console.log('team',team,'user',user)
            console.log('team name',team[0].team_name)
            res.render('team/edit-team.hbs',{team , user})
        })
    })
})

router.post('/edit-team/:id',(req,res,next)=>{
    const {id} = req.params
    const {name,surname,team_name,team_logo} = req.body

    User.findByIdAndUpdate(id,{name,surname},{new:true})
    .then((user)=>{
        Team.findOneAndUpdate({_owner:id},{team_name,team_logo},{new:true})
        .then(()=>res.redirect(`/team/mainTeam/${id}`))
    })
})

module.exports = router;