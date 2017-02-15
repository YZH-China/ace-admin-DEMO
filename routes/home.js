var express = require('express'),
	userServer = require('../service/userserver.js'),
	session = require('express-session'),
	router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	userServer.getUserById(req.query, function(data){
		if(data){
			session.username = data.username;
			res.render('home/home_main', {user: data, title: "Aceadmin Demo"});
		}
	})
  	
});

module.exports = router;
