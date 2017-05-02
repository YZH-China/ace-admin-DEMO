var queryMethod = require('./database-connect.js');

module.exports.getCommoditiesByPage = function(pageData, callback){
	var obj = pageData;
	var sql_sel_commodity_by_page = 'select * from commodity order by id ';
	sql_sel_commodity_by_page += ' limit ' + ((pageData.currentPage-1) * pageData.pageSize) + ',' + pageData.pageSize;
	var sql_count = 'select count(id) as rowcount, ceil(count(id)/' + pageData.pageSize + ') as pagecount from commodity';

	queryMethod.query(sql_count, {}, function(data){
		if(data[0]){
			obj.rowCount = data[0].rowcount;
			obj.pageCount = data[0].pagecount;
		}
		queryMethod.query(sql_sel_commodity_by_page, {}, function(data){
			if(data.length !== 0 ){
				obj.rows = data;
				callback(obj);
			}
		})
	})
}

module.exports.addNewOne = function(commodity, callback){
	var sql_ins_comm = 'insert into commodity set ?';
	queryMethod.query(sql_ins_comm, commodity, function(data){
		callback(data);
	})
}