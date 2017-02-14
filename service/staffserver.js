var staffDao = require('../dao/staff_dao.js');

module.exports.getStaffsByPage = function(callback){
	staffDao.getStaffsByPage(function(rel){
		callback(rel);
	})
};