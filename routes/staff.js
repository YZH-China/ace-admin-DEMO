var express = require('express'),
	router = express.Router(),
	staffServer = require('../service/staffserver.js');

router.get('/list', function(req, res, next){
	staffServer.getStaffsByPage(function(data){
		console.log(data);
		res.render('staff/staff_list', data);
	})
})

module.exports = router;