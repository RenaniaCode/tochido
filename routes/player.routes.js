const router = require("express").Router();

router.get('/mainPlayer',(req,res,next)=>{
    res.render('player/main.player.hbs');
})

module.exports = router;