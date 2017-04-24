var staffDao = require('../dao/staff_dao.js');
var pageData = {
	currentPage: 1,
	rowCount: 0,
	pageCount: 0,
	pageSize: 10,
	rows: []
};

module.exports.getStaffsByPage = function(callback){
	staffDao.getStaffsByPage(function(rel){
		callback(rel);
	})
};

module.exports.getStaffsGridByPage = function(body, callback){
	pageData.currentPage = body.currentPage;
	// pageData.pageSize = body.rows;
	staffDao.getStaffsGridByPage(pageData, function(data){
		if(data && data.rows.length !== 0){
			callback(data);
		}
	})
};

module.exports.addNewOne = function(newone, callback){
	staffDao.addNewOne({name: newone.name}, function(data){
		if(data.insertId){
			callback(data);
		}
	})
};

module.exports.deleteOne = function(staff, callback){
	staffDao.deleteOne({id: staff.id, name: staff.name}, function(data){
		callback(data);
	})
};

module.exports.editOne = function(body, callback){
	staffDao.editOne({ id: body.id, name: body.name }, function(data){
		callback(data);
	})
}