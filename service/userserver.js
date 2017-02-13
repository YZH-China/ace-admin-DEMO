var userDao = require('../dao/user_dao.js');

module.exports.userRegister = function(values, callback){
	userDao.userRegister(values, function(rel){
		if(rel){
			callback(true);
		} else {
			callback(false);
		}
	})
};

module.exports.login = function(values, callback){
	userDao.login(values, function(rel){
		if(rel.length == 0){
			callback(false);
		} else {
			callback(true);
		}
	})
};