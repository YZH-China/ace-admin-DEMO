var fs = require("fs");

module.exports.getJson = function(filename, callback){
	var data = fs.readFileSync(__dirname.replace(/service/, '') + '/public/json/'+ filename +'.txt'),
		data_area = [],
		data_cities = [],
		data_counties = [];
	data = JSON.parse(data);
	
	for(var i = 0; i < data.length; i += 1){
		if(data[i].level === 1){
			data[i].cities = [];
			data_area.push(data[i]);
		} else if(data[i].level === 2){
			data[i].conuties = [];
			data_cities.push(data[i]);
		} else {
			data_counties.push(data[i]);
		}
	}
	/**
	 * 三级循环，构建正确的省、地、县结构
	 */
	for(var i = 0; i < data_area.length; i += 1){
		for(var j = 0; j < data_cities.length; j += 1){
			if(data_area[i].sheng === data_cities[j].sheng){
				for(var k = 0; k < data_counties.length; k += 1){
					if(data_counties[k].di === data_cities[j].di && data_counties[k].sheng === data_area[i].sheng){
						data_cities[j].conuties.push(data_counties[k]);
					}
				}
				data_area[i].cities.push(data_cities[j]);
			}
		}
	}


	callback(data_area);
}