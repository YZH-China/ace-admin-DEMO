var queryMethod = require('./database-connect.js');

module.exports.userRegister = function(values, callback){
	var sql = "insert into user set ?, reg_date=now()";
	queryMethod.query(sql, values, function(rel){
		callback(rel);
	})
};

module.exports.login = function(values, callback){
	var sql = "select * from user where ? and ?",
	 	arr_values = queryMethod.objectToArray(values);
	queryMethod.query(sql, arr_values, function(results){
		callback(results);
	})
};

module.exports.getUserById = function(id, callback){
	var sql = "select * from user where ?"
	queryMethod.query(sql, id, function(rel){
		callback(rel);
	})	
};

module.exports.updateUserInfo = function(user, callback){
	var sql = "update user set ?";
	queryMethod.query(sql, user, function(rel){
		callback(rel);
	})
}