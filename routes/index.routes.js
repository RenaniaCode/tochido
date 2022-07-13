const router = require("express").Router();
const Team = require('../models/Team.model');
const User = require('../models/User.model');
const Player = require('../models/Player.model');
const League = require('../models/League.model');

/* GET home page */
router.get("/", (req, res, next) => {
  const {id} = req.body;
  console.log('ide select',id);
  League.find()
  .populate('_teams')
  .then((league)=>{
      console.log('league',league)
      /*const data = league._teams;
      console.log('data',data)
      const sorted = data.filter((team)=>team.points).sort((a,b)=>b.points-a.points); */
      res.render("index", {user:req.user , league});
  })
});



module.exports = router;
