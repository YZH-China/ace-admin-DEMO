var express = require("express"),
	router = express.Router(),
	fileServer = require('../service/fileserver.js');

router.post('/json', function(req, res, next){
	fileServer.getJson(req.body.filename, function(data){
		res.send(data);
	})
})

module.exports = router;