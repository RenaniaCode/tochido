const router = require("express").Router();
const Admin = require('../models/League.model');
const User = require('../models/User.model');

router.get('/mainLeague/:id',(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .then((user)=>{
        Admin.findOne({'_owner':`${id}`})
        .then(((admin)=>{
        console.log('coach',admin);
        res.render('league/main.league.hbs',{user , admin});
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

    Admin.create({ league_name , league_logo , country , _owner:id })
    .then((admin)=>{
        User.findById(id)
        .then((user)=>{
            console.log('Owner',user)
            res.redirect(`/league/mainLeague/${user._id}`);
        })
    })
    .catch(error=>console.log('error',error))
})

module.exports = router;