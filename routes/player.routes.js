const router = require("express").Router();
const Player = require('../models/Player.model');
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const League = require("../models/League.model");
const fileUploader = require('../config/cloudinary.config');
const Match = require("../models/Match.model");


router.get('/mainPlayer/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Player.findOne({'_owner':`${id}`})
        .populate('_teamOwner')
        .then((player=>{
            // console.log('player team owner',player._teamOwner)
            if(player._teamOwner === null){
                console.log('inside if null')
                res.render('player/main-player.hbs',{user , player , id});
            }
            else {
                const leagueId = player._teamOwner._leagueOwner;
                console.log('leagueId',player._teamOwner._leagueOwner)
                League.findById(leagueId)
                .populate('_teams _warning _matches')
                .then((league)=>{
                    console.log('league._id',league._id)
                    const ownerLeague = league._id;
                    Match.find({_owner:ownerLeague})
                    .populate('teamLocal teamVisitor')
                    .then((match)=>{
                        console.log('match',match[0])
                        const data = league._teams;
                        const sorted = data.filter((team)=>team.points).sort((a,b)=>b.points-a.points)
                        res.render('player/main-player.hbs',{user , player , id , data , sorted , league , match});
                    })
                })
            }
        }))
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

router.post('/edit-player/:id',fileUploader.single('profile_pic'),(req,res,next)=>{
    const {id} = req.params
    const {name,surname, number , position , age , height , nickname} = req.body

    User.findByIdAndUpdate(id,{name,surname},{new:true})
    .then(()=>{
        Player.findOneAndUpdate({_owner:id},{profile_pic:req.file.path , number , position , age , height , nickname},{new:true})
        .then(()=>res.redirect(`/player/mainPlayer/${id}`))
    })
})

router.get('/mainPlayer/:id/lineup/watch',(req,res,next)=>{
    const {id} = req.params;

    Player.find({_owner:id})
    .then((player)=>{
        console.log('player',player)
        const teamId = player[0]._teamOwner;
        console.log('teamId',teamId)
        Team.findById(teamId)
        .populate('playbook')
        .then((team)=>{
            console.log('playbook',team)
            res.render('player/watch-lineups',{team , id})
        })
    })
    .catch((error)=>{console.log('error',error)})
})

module.exports = router;