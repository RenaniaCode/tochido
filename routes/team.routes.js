const router = require("express").Router();
const Coach = require('../models/Coach.model');
const User = require('../models/User.model');

router.get('/mainTeam/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Coach.findOne({'_owner':`${id}`})
        .then((coach=>{
        console.log('coach',coach);
        res.render('team/main.team.hbs',{user , coach});
    }))
    })
    .catch(error=>console.log('error',error))
})

router.get('/edit-team/:id',(req,res,next)=>{
    const { id } = req.params;
    User.findById(id)
    .then((user)=>{
        console.log('user owner', user)
        res.render('team/edit.team.hbs',{user});
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

module.exports = router;