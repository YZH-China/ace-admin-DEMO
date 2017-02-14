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
		if(rel.length){
			callback(rel[0].id);
		} else {
			callback(0);
		}
	})
};

module.exports.getUserById = function(id, callback){
	userDao.getUserById(id, function(rel){
		if(rel.length){
			callback(rel[0]);
		} else {
			callback(false);
		}
	})
}