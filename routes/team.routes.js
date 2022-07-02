const router = require("express").Router();
const Coach = require('../models/Coach.model');

router.get('/mainTeam',(req,res,next)=>{
    res.render('team/main.team.hbs');
})

router.get('/edit-team',(req,res,next)=>{
    res.render('team/edit.team.hbs');
})

router.post('/edit-team',(req,res,next)=>{
    const { team_name , team_logo } = req.body;

    Coach.create({ team_name , team_logo })
    .then(()=>{
        res.render('team/main.team.hbs');
    })
    .catch(error=>console.log('error',error))
})

module.exports = router;