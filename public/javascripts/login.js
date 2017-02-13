jQuery(function($) {
	/**
	 * 密码找回、登录、注册界面跳转
	 */
 	$(document).on('click', '.toolbar a[data-target]', function(e) {
	    e.preventDefault();
	    var target = $(this).data('target');
	    $('.widget-box.visible').removeClass('visible');
	    $(target).addClass('visible');
	})
	/**
	 * 背景变换，.blur-login/.light-login/无
	 */
	$('.navbar-fixed-top').on('click', 'a', function(e){
		e.preventDefault();
		e.stopPropagation();
		var key = $(this).html().toLowerCase(),
			body = $('body');
		body.removeClass('blur-login').removeClass('light-login');
		if(key !== ''){
			body.addClass(key + '-login');
		}
	})
	/**
	 * 错误信息对象
	 */
	var errorMsg = {
		emailMsg: {
			null: "错误！ &nbsp; 请输入邮箱地址！",
			formart: "错误！ &nbsp; 请输入正确的邮箱地址！"
		},
		usernameMsg: {
			null: "错误！ &nbsp; 请输入用户名！",
			illegalCharacter: "非法字符！ &nbsp; 用户名由数字、字母、_、- 组成！",
			lengthLimit: "长度限制！ &nbsp; 用户名长度为6-16字符！"
		},
		passwordMsg: {
			null: "错误！ &nbsp; 请输入密码！",
			illegalCharacter: "非法字符！ &nbsp; 密码由数字、字母、非空格特殊字符组成！",
			lengthLimit: "长度限制！ &nbsp; 密码长度为6-16字符！"
		},
		repeatPasMsg: {
			null: "错误！ &nbsp; 请确认密码！",
			wrong: "错误！ &nbsp; 两次输入不相同！"
		},
		agreementMsg: {
			notChecked: "请先阅读《用户协议》！"
		}
	};

	/**
	 * 注册对象，包括要检测的属性和检测方法
	 */
	var register = {
		email: '',
		username: '',
		password: '',
		passwordRepeat: '',
		agreement: false,
		boolEmail: false,
		boolUsername: false,
		boolPassword: false,
		boolRepeatPas: false,
		/**
		 * 之后是个属性检查函数
		 */
		checkEmail: function(obj){
			var regEmail = /^([\da-z\._-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
			if(this.email === ''){
				return showCheckError(obj, errorMsg.emailMsg.null);
			} else {
				if(regEmail.test(this.email)){
					return showCheckSuccess(obj);
				} else {
					return showCheckError(obj, errorMsg.emailMsg.formart);
				}
			}
		},
		checkUsername: function(obj){
			var regUsernameCharacter = /^[\da-zA-Z_-]+$/,
				regUsernameLength = /^.{6,16}$/;
			if(this.username === ''){
				return showCheckError(obj, errorMsg.usernameMsg.null);
			} else {
				if(regUsernameCharacter.test(this.username)){
					if(regUsernameLength.test(this.username)){
						return showCheckSuccess(obj);
					} else {
						return showCheckError(obj, errorMsg.usernameMsg.lengthLimit);
					}
				} else {
					return showCheckError(obj, errorMsg.usernameMsg.illegalCharacter);
				}
			}
		},
		checkPassword: function(obj){
			var regPasswordCharacter = /^[^\s]+$/,
				regPasswordLength = /^.{6,16}$/;
			if(this.password === ''){
				return showCheckError(obj, errorMsg.passwordMsg.null);
			} else {
				if(regPasswordCharacter.test(this.password)){
					if(regPasswordLength.test(this.password)){
						return showCheckSuccess(obj);
					} else {
						return showCheckError(obj, errorMsg.passwordMsg.lengthLimit);
					}
				} else {
					return showCheckError(obj, errorMsg.passwordMsg.illegalCharacter);
				}
			}
		},
		checkRepeatPas: function(obj){
			if(this.passwordRepeat !== ''){
				if(this.password !== this.passwordRepeat){
					return showCheckError(obj, errorMsg.repeatPasMsg.wrong);
				} else {
					return showCheckSuccess(obj);
				}
			} else {
				return showCheckError(obj, errorMsg.repeatPasMsg.null);
			}
			
		}
	},
	/**
	 * 登录对象
	 */
	login = {
		username: '',
		password: '',
		boolUsername: false,
		boolPassword: false,
		checkUsername: function(obj){
			if(this.username === ''){
				return showCheckError(obj, errorMsg.usernameMsg.null);
			} else {
				return showCheckSuccess(obj);
			}
		},
		checkPassword: function(obj){
			if(this.password === ''){
				return showCheckError(obj, errorMsg.passwordMsg.null);
			} else {
				return showCheckSuccess(obj);
			}
		}
	};
	/**
	 * 注册检查成功和失败的处理函数
	 */
	function showCheckSuccess(obj){
		obj.parents('.form-group').removeClass('has-error').addClass('has-success');
		$("#reg-info").slideUp(400);
		return true;
	}
	function showCheckError(obj, str){
		obj.parents(".form-group").removeClass('has-success').addClass("has-error");
		slideDown(str);
		return false;
	}
	/**
	 * 检查失败的提示信息展示函数
	 */
	function slideDown(str){
		var info = $("#reg-info");
		info.find('strong').html("<i class='ace-icon fa fa-times'></i>" + str);
		info.slideDown(400);
	}

	/**
	 * 注册操作与对象的绑定
	 */
	$("#u_email").on({
		keyup: function(e){
			register.email = $(this).val();
		},
		blur: function(e){
			register.boolEmail = register.checkEmail($(this));
		}
	})
	$("#username").on({
		keyup: function(e){
			register.username = $(this).val();
		},
		blur: function(e){
			register.boolUsername = register.checkUsername($(this));
		}
	})
	$("#password").on({
		keyup: function(e){
			register.password = $(this).val();
		},
		blur: function(e){
			register.boolPassword = register.checkPassword($(this));
		}
	})
	$("#re_password").on({
		keyup: function(e){
			register.passwordRepeat = $(this).val();
		},
		blur: function(e){
			register.boolRepeatPas = register.checkRepeatPas($(this));
		}
	})
	$("#reg-agreement").on('change', function(e){
		register.agreement = $(this).get(0).checked;
	})
	/**
	 * 登录操作和对象绑定 
	 */
	$("#username-login").on({
		keyup: function(e){
			login.username = $(this).val();
		},
		blur: function(e){
			login.boolUsername = login.checkUsername($(this));
		}
	})
	$("#password-login").on({
		keyup: function(e){
			login.password = $(this).val();
		},
		blur: function(e){
			login.boolPassword = login.checkPassword($(this));
		}
	})
	
	/**
	 * 注册按钮点击事件
	 */
	$("#btn-register").on('click', function(e){
		if(register.agreement){
			if(register.boolEmail){
				if(register.boolUsername){
					if(register.boolPassword){
						if(register.boolRepeatPas){
							$.ajax({
								url:'/users/register',
								type:'post',
								data:{username:register.username, password:register.password, email:register.email},
								success: function(data){
									if(data){
										$("#modal-success").modal({});
									} else {
										$("#modal-failed").modal({});
									}
								}
							})
						} else {
							register.checkRepeatPas($("#re_password").focus());
						}
					} else {
						register.checkPassword($("#password").focus());
					}
				} else {
					register.checkUsername($("#username").focus());
				}
			} else {
				register.checkEmail($("#u_email").focus());
			}	
		} else {
			slideDown(errorMsg.agreementMsg.notChecked);
		}
	})
	/**
	 * 重置按钮事件
	 */
	$("#reg-reset").on('click', function(e){
		$("input").val('');
	})
	/**
	 * 登录按钮点击事件
	 */
	$("#btn-login").on('click', function(e){
		if(login.boolUsername){
			if(login.boolPassword){
				$.ajax({
					url:'/users/login',
					type:'post',
					data:{username:login.username, password:login.password},
					success: function(data){
						console.log(data);
					}
				})
			} else {
				login.checkPassword($("#password-login"));
			}
		} else {
			login.checkUsername($("#username-login"));
		}
	})
})