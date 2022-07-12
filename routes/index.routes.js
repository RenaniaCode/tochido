const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log("si llega", req.user)
  res.render("index", {user:req.user});
});



module.exports = router;
