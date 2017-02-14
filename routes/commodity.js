var express = require('express'),
	router = express.Router();

router.get('/list', function(req, res, next){
	console.log('/commodity/list');
})

module.exports = router;