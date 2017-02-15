var queryMethod = require('./database-connect.js');

module.exports.getStaffsByPage = function(callback){
	var sql_all_staff = "select * from staff";
	queryMethod.query(sql_all_staff, {}, function(rel){
		callback(rel);
	})
};