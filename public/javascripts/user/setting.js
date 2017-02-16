jQuery(function($){
	var observer = {}, //观察者单例对象
		userChange = {
			email: '',
			niconame: '',
			birthday: '',
			gender: 0,
			comment: '',
			website: '',
			phone: '',
			facebook: '',
			twitter: '',
			google: '',
			province: '',
			city: '',
			county: '',
			address: ''
		};
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

	//订阅对象
	var userToken = observer.subscribe("user", function(user){
		if(!this.user){
			this.user = user;
		}
		var flag = false;
		for(var prop in user){
			if(user.hasOwnProperty(prop)){
				if(user[prop] !== this.user[prop]){
					this.user[prop] = user[prop];
					flag = true;
					break;
				}
			}
		};
		if(flag){
			//有变化
			observer.publish('user', userChange);
		}
	})
	//首次发布，初始化
	observer.publish('user', userChange);

	/**
	 * 绑定操作事件
	 */
	//昵称绑定
	$("#form-field-niconame").on('keyup', function(e){
		userChange.niconame =  $(this).val();
		observer.publish('user', userChange);
	});
	//出生日期绑定
	$("#form-field-birthday").on({
		change: function(e){
			userChange.birthday = $(this).val();
			observer.publish('user', userChange);
		}
	});
	//性别操作绑定
	$("#form-field-radio").on('click', 'input[name="form-field-radio"]', function(e){
		userChange.gender = parseInt($(this).attr('value'), 10);
		observer.publish('user', userChange);
		console.log(observer.user.gender);
	});
})