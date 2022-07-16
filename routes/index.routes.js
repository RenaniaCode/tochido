const router = require("express").Router();
const Team = require('../models/Team.model');
const User = require('../models/User.model');
const Player = require('../models/Player.model');
const League = require('../models/League.model');
const fileUploader = require('../config/cloudinary.config');
const Match = require("../models/Match.model");

/* GET home page */
router.get("/", (req, res, next) => {
  const {id} = req.body;
  console.log('ide select',id);
  League.find()
  .populate('_teams _matches')
  .then((league)=>{
      console.log('league',league)
      League.findOne()
      .populate('_teams _matches _warning')
      .then((specific)=>{
        console.log('league._id',specific._id)
                    const ownerLeague = specific._id;
                    Match.find({_owner:ownerLeague})
                    .populate('teamLocal teamVisitor')
                    .then((match)=>{
                      console.log('specific',specific._warning);
                        const data = specific._teams;
                        const sorted = data.filter((team)=>team.points).sort((a,b)=>b.points-a.points)
                        res.render('index',{user:req.user,specific , id , data , sorted , league , match});
                    })
      })
  })
});



module.exports = router;
