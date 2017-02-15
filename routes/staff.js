var express = require('express'),
	router = express.Router(),
	session = require("express-session"),
	staffServer = require('../service/staffserver.js');

router.get('/list', function(req, res, next){
	staffServer.getStaffsByPage(function(data){
		res.render('staff/staff_list', {
			user: {username: session.username, id:session.userid},
			titile:"Aceadmin Demo",
			staffs: data
		});
	})
})

module.exports = router;