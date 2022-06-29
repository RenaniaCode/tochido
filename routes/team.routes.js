const router = require("express").Router();

router.get('/mainTeam',(req,res,next)=>{
    res.render('team/main.team.hbs');
})

module.exports = router;