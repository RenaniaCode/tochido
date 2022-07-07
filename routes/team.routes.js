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
    .then((team)=>{
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
        console.log('team',show._players)
        /* const teamId = team[0]._id
        console.log('team id',teamId) */
        /* Player.find({_teamOwner:teamId})
        .then((players)=>{
            console.log('players con el id team',players,'id team',teamId)
 */            res.render('team/addPlayers-team.hbs',{ id , show });
       /*  }) */
    })
    .catch(error=>console.log('error',error))

})

router.post('/mainTeam/:id/add-players',(req,res,next)=>{
    const {id} = req.params;
    const {player_id} = req.body;
    console.log('player id', player_id)

    Coach.findOneAndUpdate({_owner: id},{_players:`${player_id}`})
    /* .populate('_players') */
    .then((coach)=>{
        console.log('players',coach._players , 'coach' , coach)
        res.redirect(`/team/mainTeam/${id}`)
    })
    .catch(error=>next(error))

})

module.exports = router;