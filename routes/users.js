var express = require('express'),
	userServer = require("../service/userserver.js"),
	session = require("express-session"),
	router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
	if(session.userid){
		res.redirect('/home?id=' + session.userid);
	} else {
		//登录界面渲染
		res.render('login/login', {title: "Aceadmin Demo"});
	}
 	
});

//用户注册存储
router.post('/register', function(req, res, next){
	userServer.userRegister(req.body, function(rel){
		res.send(rel);
	})
});

//登录检查
router.post('/login', function(req, res, next){
	userServer.login(req.body, function(data){
		session.userid = data;
		res.send(data.toString());
	})
})

//用户中心页面渲染
router.get('/profile', function(req, res, next){
	userServer.getUserById(req.query, function(data){
		res.render('user/profile', {
			user:data,
			title: "Aceadmin Demo"
		});
	})
});

//用户信息设置页面渲染
router.get('/setting', function(req, res, next){
	userServer.getUserById(req.query, function(data){
		res.render('user/setting', {
			user: data,
			title: "Aceadmin Demo"
		})
	})
})

module.exports = router;
