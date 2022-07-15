const router = require("express").Router();
const League = require('../models/League.model');
const User = require('../models/User.model');
const Team = require('../models/Team.model');
const Warning = require('../models/Warning.model');
const Match = require('../models/Match.model');

router.get('/mainLeague/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        League.findOne({'_owner':`${id}`})
        .populate('_teams _warning _matches')
        .then(((league)=>{
        console.log('coach',league);
        const numTeams = league._teams.length;
        res.render('league/main.league.hbs',{user , league , numTeams});
    }))
    })
    .catch(error=>console.log('error',error))
})

router.get('/create-league/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('league/create-league.hbs',{user});
    })
    .catch(error=>console.log('error',error))
})

router.post('/create-league/:id',(req,res,next)=>{

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

router.get('/mainLeague/delete/:_id',(req,res,next)=>{
    const {_id} = req.params;

    Team.findById(_id)
    .then(team=>{
        console.log('team league owner',team._leagueOwner)
        League.findByIdAndUpdate(team._leagueOwner,{$pull:{_teams:_id}})
        .then((league)=>{
            console.log('league id',league._id)
            Team.findByIdAndUpdate(_id,{_leagueOwner:null})
            .then(()=>{
                res.redirect(`/league/mainLeague/${league._owner}`)
            })
        })
    })
    .catch(error=>console.log('error',error))
})


router.get('/mainLeague/edit-stats/:id',(req,res,next)=>{
    const {id} = req.params
    
    Team.findById(id)
    .then(team=>{
        console.log('team',team)
        res.render('league/edit-stats.hbs',{team})
    })
    .catch(error=>console.log('error',error))
})

router.post('/mainLeague/edit-stats/:id',(req,res,next)=>{
    const {id} = req.params
    const {points , gamesPlayed , wins , defeats , draws} = req.body

    Team.findByIdAndUpdate(id,{points , gamesPlayed , wins , defeats , draws},{new:true})
    .populate('_leagueOwner')
    .then(team=>{
        console.log('team',team._leagueOwner._owner)
        const _id = team._leagueOwner._owner
        res.redirect(`/league/mainLeague/${_id}`)
    })
    .catch(error=>console.log('error',error))
})

router.get('/edit-league/:id',(req,res,next)=>{
    const {id} = req.params

    User.findById(id)
    .then((user)=>{
        League.find({_owner:id})
        .then((league)=>{
            console.log('league',league,'user',user)
            console.log('league name',league[0].league_name)
            res.render('league/edit-league.hbs',{league , user})
        })
    })
})

router.post('/edit-league/:id',(req,res,next)=>{
    const {id} = req.params
    const {name,surname,league_name,league_logo,country} = req.body

    User.findByIdAndUpdate(id,{name,surname},{new:true})
    .then((user)=>{
        League.findOneAndUpdate({_owner:id},{league_name,league_logo,country},{new:true})
        .then(()=>res.redirect(`/league/mainLeague/${id}`))
    })
})

router.get('/mainLeague/warning/:id',(req,res,next)=>{
    const {id} = req.params;

    League.find({_owner:id})
    .populate('_warning')
    .then((league)=>{
        console.log('league',league[0]._warning)
        res.render('league/warnings.hbs',{league , id})
    })
    .catch(error=>console.log('error',error))
})

router.post('/mainLeague/warning/:id', async (req,res,next)=>{
    const {id} = req.params;
    const {header,text} = req.body;

    League.find({_owner:id})
    .then((league)=>{
        console.log('league id',league[0]._id)
        Warning.create({header,text,_owner:league[0]._id})
        .then((warning)=>{
            League.findOneAndUpdate({_owner:id},{$push:{_warning:warning}})
            .then(()=>{
                res.redirect(`/league/mainLeague/${id}`);
            })
        })
    })
})

router.get('/mainLeague/warning/:_id/delete',(req,res,next)=>{
    const {_id} = req.params;

    Warning.findById(_id)
    .then((warning)=>{
        const league_id = warning._owner;
        console.log('leagueId',league_id)
        League.findByIdAndUpdate(league_id,{$pull:{_warning:_id}})
        .then((league)=>{
            Warning.findByIdAndDelete(_id)
            .then(()=>{
                res.redirect(`/league/mainLeague/${league._owner}`)
            })
        })
    })
})

router.get('/match/:id',(req,res,next)=>{
    const {id} = req.params;

    League.find({_owner:id})
    .populate('_teams')
    .then((league)=>{
        res.render('league/create-match',{league,id})
    })
})

router.post('/match/:id',(req,res,next)=>{
    const {id} = req.params;
    const {teamLocal , scoreLocal , teamVisitor , scoreVisitor , date , hour , week} = req.body;

    League.find({_owner:id})
    .populate('_teams')
    .then((league)=>{
        Match.create({teamLocal , scoreLocal , teamVisitor , scoreVisitor , date , hour , week , _owner:league[0]._id})
        .then((match)=>{
            League.findOneAndUpdate({_owner:id},{$push:{_matches:match}})
            .then(()=>{
                console.log('league id',league[0]._owner)
                res.redirect(`/league/mainLeague/${league[0]._owner}`);
            })
        })
    })
})

router.get('/mainLeague/:_id/delete-match',(req,res,next)=>{
    const {_id} = req.params;

    Match.findById(_id)
    .then(match=>{
        console.log('team league owner',match._owner)
        League.findByIdAndUpdate(match._owner,{$pull:{_matches:_id}})
        .then((league)=>{
            console.log('league id',league._id)
            Match.findByIdAndDelete(_id)
            .then(()=>{
                res.redirect(`/league/mainLeague/${league._owner}`)
            })
        })
    })
    .catch(error=>console.log('error',error))
})

module.exports = router;