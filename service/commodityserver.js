var commodityDao = require('../dao/commodity_dao.js');

module.exports.getCommoditiesByPage = function(callback){
	commodityDao.getCommoditiesByPage(function(rel){
		callback(rel);
	})
}