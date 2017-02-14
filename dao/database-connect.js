var mysql = require("mysql");
var pool = mysql.createPool({
	host:"localhost",
	user:"root",
	password:"kkyuan234",
	database:"aceadmindemo",
	port:3306
});

var QueryMethod = {
	//普通查询
	query:function(sql, values, callback){
		pool.getConnection(function(err, connection){
			if(err){
				console.error(err);
				return;
			} else {
				connection.query(sql, values, function(qerr, results){
					//释放连接
					connection.release();
					if(qerr){
						console.error(qerr);
						return;
					} else {
						callback(results);
					}
					
				})
			}
		})
	},

	//对象转化成每个键值对为一项的对象数组
	objectToArray:function(obj){
		var arr = [];
		for(var keys in obj){
			var empty = {};
			empty[keys] = obj[keys];
			arr.push(empty);
		}
		return arr;
	}

};

module.exports = QueryMethod;