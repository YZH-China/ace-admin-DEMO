var express = require('express'),
	router = express.Router(),
	session = require("express-session"),
	commodityServer = require('../service/commodityserver.js');

router.get('/list', function(req, res, next){
	// commodityServer.getCommoditiesByPage(function(data){
	// 	res.render('commodity/comm_list', {
	// 		user: {username: session.username, id:session.userid},
	// 		titile:"Aceadmin Demo",
	// 		commodities: data
	// 	});
	// })
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	})
	res.end('完成');
})

router.get('/op1', function(req, res, next){
	res.render('commodity/comm_op1', {
		user: {username: session.username, id:session.userid},
		title: 'Aceadmin Demo'
	})
})

router.post('/getCommoditiesByPage', function(req, res, next){
	console.log(req.body);
	commodityServer.getCommoditiesByPage(req.body.currentPage, function(data){
		res.send(data);
	})
});

router.post('/addNewOne', function(req, res, next){
	commodityServer.addNewOne(req.body, function(data){
		res.send(data);
	})
});

router.post('/updateOne', function(req, res, next){
	console.log(req.body);
	commodityServer.updateOne(req.body, function(data){
		res.send(data);
	})
});

router.post('/deleteOne', function(req, res, next){
	commodityServer.deleteOne(req.body, function(data){
		res.send(data);
	})
})

module.exports = router;