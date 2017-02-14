var express = require('express'),
	userServer = require('../service/userserver.js'),
	router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	userServer.getUserById(req.query, function(data){
		if(data){
			res.render('home/home_main', data);
		}
	})
  	
});

module.exports = router;
