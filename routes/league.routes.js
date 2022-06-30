const router = require("express").Router();

router.get('/mainLeague',(req,res,next)=>{
    res.render('league/main.league.hbs');
})

module.exports = router;