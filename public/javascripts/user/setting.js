jQuery(function($){
	var observer = {}, //观察者单例对象
		userChange = {
			email: $("#form-field-email").val(),
			niconame: $("#form-field-niconame").val(),
			birthday: $("#form-field-birthday").val(),
			gender: $("input[name='form-field-radio']")[0].checked ? 1 : $("input[name='form-field-radio']")[1].checked ? 2 : 0,
			comment: $("#form-field-comment").val(),
			website: $("#form-field-website").val(),
			phone: $("#form-field-phone").val(),
			facebook: $("#form-field-facebook").val(),
			twitter: $("#form-field-twitter").val(),
			google: $("#form-field-google").val(),
			province: $("#form-field-select-province").val(),
			city: $("#form-field-select-city").val(),
			county: $("#form-field-select-county").val(),
			address: $("#form-field-address").val()
		}, //缓存对象
		btn_submit = $("#btn-submit");
	(function(p){
		var topics = {}, //该对象保存着所有订阅
			subUid = -1; //订阅实例的token值，保持唯一。

		//订阅方法
		p.subscribe = function(topic, func){
			if(!topics[topic]){
				topics[topic] = [];
			}
			var token = (++subUid).toString();
			topics[topic].push({
				token: token,
				func: func
			});
			return token;
		};
		//发布方法
		p.publish = function(topic, args){
			if(!topics[topic]){
				return false;
			}
			setTimeout(function(){
				var subscribers = topics[topic],
					len = subscribers.length;
				//实现后订阅的方法，先处理
				while(len--){
					subscribers[len].func.call(p, args);
				}
			}, 0);
			return true;
		};
		//退订方法
		p.unSubscribe = function(token){
			for(var m in topics){
				if(topics[m]){
					for(var i = 0, j = topics[m].length; i < j; i += 1){
						if(topics[m][i].token === token){
							topics[m].splice(i, 1);
							return token;
						}
					}
				}
			}
		};
	}(observer));
	/**
	 * 缓存初始状态。
	 */
	observer.user = {};
	for(var m in userChange){
		if(userChange.hasOwnProperty(m)){
			observer.user[m] = userChange[m];
		}
	}

	/**
	 * 三级联动选择框
	 */
	//获取数据
	$.ajax({
		url: '/loadfile/json',
		type: 'POST',
		dataType: 'json',
		data: {filename: 'chinaarea'},
		success: getAreaDate
	});
	//ajax回调处理函数，所有关于三级联动的调用都在内部。
	function getAreaDate(data){
		observer.chinaarea = data;
		//订阅初始化函数，构建省、直辖市选择框
		//args是个对象，obj属性是下拉框的jq对象，data属性是该下拉框的值数组
		var provinceToken = observer.subscribe('fulldropdown', function(args){
			for(var i = 0; i < args.data.length; i += 1){
				$('<option></option>').attr('value', args.data[i][args.level]).html(args.data[i].name).appendTo(args.obj);
			}
		});

		//发布调用
		observer.publish('fulldropdown', {
			obj: $("#form-field-select-province"),
			data: data,
			level: 'sheng'
		})

		//操作事件绑定
		//省、直辖市选择框‘change’事件
		$("#form-field-select-province").on('change', function(e){
			$("#form-field-select-city").empty().append($('<option disabled selected value="">请选择地级市</option>'));
			$("#form-field-select-county").empty().append($('<option disabled selected value="">请选择县级市</option>'));
			userChange.city = '';
			userChange.county = '';
			for(var i = 0; i < data.length; i += 1){
				if(data[i].sheng === $(this).val()){
					userChange.province = data[i].name;
					observer.curCities = data[i].cities;
					observer.publish('fulldropdown', {
						obj: $("#form-field-select-city"),
						data: data[i].cities,
						level: 'di'
					})
				}
			}
		})
		//地级市选择框‘change’事件
		$("#form-field-select-city").on('change', function(e){
			$("#form-field-select-county").empty().append($('<option disabled selected value="">请选择县级市</option>'));
			userChange.county = '';
			for(var i = 0; i < observer.curCities.length; i += 1){
				if(observer.curCities[i].di === $(this).val()){
					userChange.city = observer.curCities[i].name;
					observer.curCounties = observer.curCities[i].conuties;
					observer.publish('fulldropdown', {
						obj: $("#form-field-select-county"),
						data: observer.curCounties,
						level: 'xian'
					})
				}
			}
		})
		//县级市选择框‘change’事件
		$("#form-field-select-county").on('change', function(e){
			for(var i = 0; i < observer.curCounties.length; i += 1){
				if(observer.curCounties[i].xian === $(this).val()){
					userChange.county = observer.curCounties[i].name;
				}
			}
		})
	};

	/**
	 * 控件显示值和userChange对象值双向绑定
	 */
	(function(){
		//订阅控件与userChange对象的双向绑定的处理函数
		
		//一个单向绑定：控件 ————> 对象
		//args:{
		//	prop: string 对应userChange对象的属性名
		//	val: 主动改变的值。
		//}
		var bidBinding_c_o_Token = observer.subscribe('bidBinding_control_object', function(args){
			userChange[args.prop] = args.val;
		});

		//另一个单向绑定：对象 ————> 控件
		//args:{
		//	prop: 已经改变的属性值
		//	ctrl: jQuery查询的类数组对象
		//}
		var bidBindging_o_cToken = observer.subscribe('bidBinging_object_control', function(args){
			if(args.ctrl.length === 1){
				var tagname =  args.ctrl.get(0).tagName.toLowerCase();
				switch(tagname){
					case 'select':
						$("#form-field-select-province").empty().append($('<option disabled selected value="">请选择省、直辖市</option>'));
						$("#form-field-select-city").empty().append($('<option disabled selected value="">请选择地级市</option>'));
						$("#form-field-select-county").empty().append($('<option disabled selected value="">请选择县级市</option>'));
						observer.publish('fulldropdown', {
							obj: $("#form-field-select-province"),
							data: observer.chinaarea,
							level: 'sheng'
						});
						break;
					default:
						args.ctrl.val(userChange[args.prop]);
						break;
				}
			} else {
				args.ctrl.each(function(index, el) {
					el.checked = false;
				});
			}
		})
	}())
	

	/**
	 * 绑定控件的操作事件
	 */
	//昵称
	$("#form-field-niconame").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'niconame',
			val: $(this).val()
		})
	})
	//生日
	$("#form-field-birthday").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'birthday',
			val: $(this).val()
		})
	})
	//性别
	$("input[name='form-field-radio']").each(function(index, el) {
		el.onclick = function(){
			observer.publish('bidBinding_control_object', {
				prop: 'gender',
				val: ~~el.value
			})
		}
	});
	//邮箱
	$("#form-field-email").on('change', function(e){
		var regEmail = /^([\da-z\._-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
		if(regEmail.test($(this).val())){
			observer.publish('bidBinding_control_object', {
				prop: 'email',
				val: $(this).val()
			})
			$(this).popover('hide');
			btn_submit.removeClass('disabled');
		} else {
			bindPopover($(this), "请输入正确的邮箱地址！", "格式错误！");
			$(this).popover('show');
			btn_submit.addClass('disabled');
		}
	});
	//个人网站
	$("#form-field-website").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'website',
			val: $(this).val()
		})
	})
	//联系电话
	$("#form-field-phone").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'phone',
			val: $(this).val()
		})
	})
	//facebook
	$("#form-field-facebook").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'facebook',
			val: $(this).val()
		})
	})
	//twitter
	$("#form-field-twitter").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'twitter',
			val: $(this).val()
		})
	})
	//google
	$("#form-field-google").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'google',
			val: $(this).val()
		})
	})
	//address
	$("#form-field-address").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'address',
			val: $(this).val()
		})
	})
	//comment
	$("#form-field-comment").on('change', function(e){
		observer.publish('bidBinding_control_object', {
			prop: 'comment',
			val: $(this).val()
		})
	})
	//重置按钮
	$("#btn-reseat").on('click', function(e){
		for(var m in observer.user){
			if(userChange[m] === observer.user[m]){
				continue;
			} else {
				userChange[m] = observer.user[m];
				if(m !== 'gender' && m !== 'province' && m !== 'city' && m !== 'county'){
					observer.publish('bidBinging_object_control', {
						prop: m,
						ctrl: $("#form-field-" + m)
					})
				} else if(m === 'province' || m === 'city' || m === 'county'){
					observer.publish('bidBinging_object_control', {
						prop: m,
						ctrl: $("#form-field-select-" + m)
					})
				} else {
					observer.publish('bidBinging_object_control', {
						prop: m,
						ctrl: $("input[name='form-field-radio']" )
					})
				}
			}
		}
	})
	//确认修改
	btn_submit.on('click', function(e){
		
		var i = 0; //进行循环的轮数
		for(var m in observer.user){
			if(observer.user[m] === userChange[m]){
				i++;
			} else {
				break;
			}
		}
		if(i === getPropCount(userChange)){
			//说明没有有变化，不能提交
			$.gritter.add({
				title: '验证错误！',
				text: '请提交前确保有修改的内容，原样提交不被允许！',
				class_name: 'gritter-error gritter-light gritter-center'
			});
		} else {
			//可以提交
			$.ajax({
				url: '/users/updating',
				type: 'POST',
				data: userChange,
				success: function(data){
					$.gritter.add({
						title: '修改成功！',
						text: '已成功修改信息！',
						time: 1000,
						class_name: 'gritter-success gritter-light gritter-center'
					});
					setTimeout(function(){
						window.history.go(0);
					}, 1200)
				}
			})
		}
	})

	/**
	 * 获取对象属性个数
	 */
	function getPropCount(obj){
		var count = 0;
		for(var m in obj){
			if(obj.hasOwnProperty(m)){
				count++;
			}
		}
		return count;
	}

	/**
	 * 生成popover的函数
	 */
	function bindPopover(obj, content, title){
		obj.popover({
			content: content,
			placement: "top",
			title: "<i class='ace-icon fa fa-bolt red'></i> &nbsp;&nbsp"+ title,
			html: true,
			template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content red"></div></div>',
			trigger: 'manual'
		})
	};

	/**
	 * date-picker
	 */
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true
	})
	.next().on('click', function(){
		$(this).prev().focus();
	});
})