const router = require("express").Router();
const League = require('../models/League.model');
const User = require('../models/User.model');
const Team = require('../models/Team.model');

router.get('/mainLeague/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        League.findOne({'_owner':`${id}`})
        .then(((league)=>{
        console.log('coach',league);
        res.render('league/main.league.hbs',{user , league});
    }))
    })
    .catch(error=>console.log('error',error))
})

router.get('/edit-league/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('league/edit.league.hbs',{user});
    })
    .catch(error=>console.log('error',error))
})

router.post('/edit-league/:id',(req,res,next)=>{

    const { league_name , league_logo , country } = req.body;
    const { id } = req.params

    League.create({ league_name , league_logo , country , _owner:id })
    .then((league)=>{
        User.findById(id)
        .then((user)=>{
            console.log('Owner',user)
            res.redirect(`/league/mainLeague/${user._id}`);
        })
    })
    .catch(error=>console.log('error',error))
})

router.get('/mainLeague/:id/add-team',(req,res)=>{
    const {id} = req.params;

    League.findOne({_owner:id})
    .populate('_teams _owner')
    .then((league)=>{
        /* const show = league.; */
        const numTeams = league._teams.length;
        console.log('numTeams',numTeams) 
        console.log('league teams',league._teams)
        res.render('league/addTeam-league',{league , id , numTeams});
    })
})

router.post('/mainLeague/:id/add-team', async (req,res)=>{
    const {id} = req.params;
    const {team_id} = req.body;
    console.log('team id', team_id)
    try{
        let league = await League.findOneAndUpdate({_owner:id},{$push:{'_teams': team_id}})
        let team = await Team.findByIdAndUpdate(team_id,{_leagueOwner:league._id})
        console.log('team post',team)
    }catch(error){return error}
    
    res.redirect(`/league/mainLeague/${id}`)
})

module.exports = router;