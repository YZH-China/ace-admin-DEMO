var express = require('express'),
	userServer = require("../service/userserver.js");
	router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  //登录界面渲染
  res.render('login/login', {});
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
		res.send(data);
	})
})

module.exports = router;
