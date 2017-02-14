var queryMethod = require('./database-connect.js');

module.exports.getStaffsByPage = function(callback){
	var sql = "select * from staff";
	queryMethod.query(sql, {}, function(rel){
		callback(rel);
	})
};