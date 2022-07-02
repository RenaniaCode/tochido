const router = require("express").Router();
const Admin = require('../models/Admin.model')

router.get('/mainLeague',(req,res,next)=>{
    res.render('league/main.league.hbs');
})

router.get('/edit-league',(req,res,next)=>{
    res.render('league/edit.league.hbs');
})

router.post('/edit-league',(req,res,next)=>{
    const { league_name , league_logo , country } = req.body;

    Admin.create({ league_name , league_logo , country })
    .then(()=>{
        res.render('league/main.league.hbs');
    })
    .catch((error)=>console.log('error',error))
})

module.exports = router;