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

router.get('/op1', function(req, res, next){
	res.render('staff/staff_op1', {
		user: {username: session.username, id: session.userid},
		title: 'Aceadmin Demo'
	})
})

router.post('/op1', function(req, res, next){
	console.log(req.body);
	res.writeHead(200, {
		'Content-Type':'text/plain'
	});
	res.end('123');
})

router.post('/getStaffsGridByPage', function(req, res, next){
	console.log(req.body);
	staffServer.getStaffsGridByPage(req.body, function(data){
		res.send(data);
	})
});

router.post('/addNewOne', function(req, res, next){
	console.log(req.body);
	staffServer.addNewOne(req.body, function(data){
		res.send(data);
	})
})

router.post('/search', function(req, res, next){
	console.log('这里是查询服务');
	res.writeHead(200, {
		'Content-Type':'text/plain'
	});
	res.end('123');
})

router.post('/deleteOne', function(req, res, next){
	staffServer.deleteOne(req.body, function(data){
		res.send(data);
	})
});

router.post('/editOne', function(req, res, next){
	staffServer.editOne(req.body, function(data){
		res.send(data);
	})
});

router.post('/query', function(req, res){
	console.log(req.body);
	staffServer.queryByName(req.body, function(data){
		res.send(data);
	})
})

module.exports = router;