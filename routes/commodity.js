var express = require('express'),
	router = express.Router(),
	session = require("express-session"),
	commodityServer = require('../service/commodityserver.js');

router.get('/list', function(req, res, next){
	commodityServer.getCommoditiesByPage(function(data){
		res.render('commodity/comm_list', {
			user: {username: session.username, id:session.userid},
			titile:"Aceadmin Demo",
			commodities: data
		});
	})
})

module.exports = router;