var queryMethod = require('./database-connect.js');

module.exports.getStaffsByPage = function(callback){
	var sql_all_staff = "select * from staff";
	queryMethod.query(sql_all_staff, {}, function(rel){
		callback(rel);
	})
};

module.exports.getStaffsGridByPage = function(pageData, callback){
	var obj = pageData;
	var sql_sel_staff_by_page = 'select * from staff order by id ';
	sql_sel_staff_by_page += ' limit ' + ((pageData.currentPage-1) * pageData.pageSize) + ',' + pageData.pageSize;
	var sql_count = 'select count(id) as rowcount, ceil(count(id)/' + pageData.pageSize + ') as pagecount from staff';

	queryMethod.query(sql_count, {}, function(data){
		if(data[0]){
			obj.rowCount = data[0].rowcount;
			obj.pageCount = data[0].pagecount;
		}
		queryMethod.query(sql_sel_staff_by_page, {}, function(data){
			if(data.length !== 0 ){
				obj.rows = data;
				callback(obj);
			}
		})
	})
}; 

module.exports.addNewOne = function(newone, callback){
	var sql_insert_staff = 'insert into staff set ?';
	queryMethod.query(sql_insert_staff, newone, function(data){
		if(data.insertId){
			callback(data);
		}
	})
};

module.exports.deleteOne = function(staff, callback){
	var sql_del_staff = 'delete from staff where id=' + staff.id + ' and name="' + staff.name + '"';
	console.log(sql_del_staff);
	queryMethod.query(sql_del_staff, {}, function(data){
		if(data.affectedRows === 1){
			callback(data);
		}
	})
};

module.exports.editOne = function(staff, callback){
	var sql_update_staff = 'update staff set ? where id=' + staff.id;
	console.log(sql_update_staff);
	queryMethod.query(sql_update_staff, {name: staff.name}, function(data){
		console.log(data);
		if(data.affectedRows === 1){
			callback(data);
		}
	})
};

module.exports.queryByName = function(query, callback){
	var sql_sel_like_name_page = "select * from staff where name like '%" + query.name + "%' limit " 
							+ ((query.pageData.currentPage-1) * query.pageData.pageSize)
							+ ',' + query.pageData.pageSize;
	var sql_sel_like_name = "select * from staff where name like '%" + query.name + "%'";
	var sql_query_page = 'select count(id) as rowcount, ceil(count(id)/' + query.pageData.pageSize + ') as pagecount from ' +
						 '(' + sql_sel_like_name + ') as result';
	console.log(sql_query_page);
	var obj = query.pageData;
	queryMethod.query(sql_query_page, {}, function(data){
		if(data[0]){
			obj.rowCount = data[0].rowcount;
			obj.pageCount = data[0].pagecount;
		}      
		queryMethod.query(sql_sel_like_name_page, {}, function(data){
			obj.rows = data;
			callback(obj);
		})
	})
}