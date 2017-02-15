var queryMethod = require('./database-connect.js');

module.exports.getCommoditiesByPage = function(callback){
	var sql_all_commodity = "select * from commodity";
	queryMethod.query(sql_all_commodity, {}, function(rel){
		callback(rel);
	})
}