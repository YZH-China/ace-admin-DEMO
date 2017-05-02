var commodityDao = require('../dao/commodity_dao.js');
var pageData = {
	currentPage: 1,
	rowCount: 0,
	pageCount: 0,
	pageSize: 10,
	rows: []
};

module.exports.getCommoditiesByPage = function(currentPage, callback){
	pageData.currentPage = currentPage;
	commodityDao.getCommoditiesByPage(pageData, function(data){
		if(data && data.rows.length !== 0){
			callback(data);
		}
	})
};

module.exports.addNewOne = function(commodity, callback){
	commodityDao.addNewOne(commodity, function(data){
		if(data.insertId){
			callback(true);
		} else {
			callback(false);
		}
	})
}