/**
 * 自定义验证方法
 */
$.validator.addMethod('noSpecialCharacter', function(value, element, params){
	//params 数组或字符串，每一项是一个非法字符
	var result = true;
	for(var i = 0; i < value.length; i += 1){
		if(params.indexOf(value[i]) !== -1){
			result = false;
			break;
		}
	}
	console.log(this.optional(element), result);

	return this.optional(element) || result
}, '输入信息中包含非法字符！')

/**
 * 验证
 */
var valodator = $("#validation-form").validate({
	errorElement: 'span',
	errorClass: 'help-block',
	focusInvalid: false,
	rules: {
		//这里匹配的是form元素下的表单控件的name属性
		email: {
			email: true,
			required: true,
			remote: {
				url: '/users/checkEmail',
				type: "post",
				data: {
					email: function() {
						return $("#email").val();
					}
				}
			}
		},
		password: {
			required: true,
			minlength: 5,
			maxlength: 16,
			noSpecialCharacter: '!@#$%^&*()<>?,./:";\':"[]{}\\|'
		},
		confirm_password: {
			required: true,
			equalTo: '#password' //jq查找器
		},
		checkboxs: {
			rangelength: [1, 2],
			required: true
		},
		date: {
			dateISO: true,
			required: true
		},
		gender: {
			required: true
		},
		agree: {
			required: true
		},
		platform: {
			required: true
		}
	},
	messages: {
		email: {
			remote: '该邮箱已存在',
			email: '请输入正确的邮箱格式！',
			required: '请输入邮箱作为用户名！'
		},
		password: {
			required: '请输入密码！',
			minlength: '密码长度最少5位',
			maxlength: '密码长度最多16位'
		},
		confirm_password: {
			required: '请确认密码！',
			equalTo: '两次输入不同'
		},
		checkboxs: {
			rangelength: '最多选择两个',
			required: '请选择复选框！'
		},
		date: {
			dateISO: '请输入正确格式的日期！',
			required: '请选择日期！'
		},
		gender: {
			required: '请选择性别！'
		},
		agree: {
			required: '请阅读用于协议！'
		},
		platform: {
			required: '请选择平台！'
		}
	},

	highlight: function (e) {
		$(e).closest('.form-group').removeClass('has-info').addClass('has-error');
	},

	success: function (e) {
		$(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
		$(e).remove();
	},

	errorPlacement: function (error, element) {
		if(element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
			var controls = element.closest('div[class*="col-"]');
			if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
			else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
		}
		else if(element.is('.select2')) {
			error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
		}
		else if(element.is('.chosen-select')) {
			error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
		}
		else error.insertAfter(element.parent());
	},

	submitHandler: function (form) {
		//验证通过
		$("#modal-success").modal({});
	},
	invalidHandler: function (form) {
		//未通过验证
		$("#modal-error").modal({});
	}
});

/*此时提交按钮为 submit 类型*/
// $("#validation-form").on('submit', function(event){
// 	//做一些操作
// })

/*此时提交按钮为 button 类型*/
$("#btn-submit").on('click', function(event){
	$("#validation-form").trigger('submit');
})

// $('#validation-form').validate({
// 	errorElement: 'div',
// 	errorClass: 'help-block',
// 	focusInvalid: false,
// 	rules: {
// 		email: {
// 			required: true,
// 			email:true
// 		},
// 		password: {
// 			required: true,
// 			minlength: 5
// 		},
// 		password2: {
// 			required: true,
// 			minlength: 5,
// 			equalTo: "#password"
// 		},
// 		name: {
// 			required: true
// 		},
// 		phone: {
// 			required: true,
// 			phone: 'required'
// 		},
// 		url: {
// 			required: true,
// 			url: true
// 		},
// 		comment: {
// 			required: true
// 		},
// 		state: {
// 			required: true
// 		},
// 		platform: {
// 			required: true
// 		},
// 		subscription: {
// 			required: true
// 		},
// 		gender: {
// 			required: true,
// 		},
// 		agree: {
// 			required: true,
// 		}
// 	},

// 	messages: {
// 		email: {
// 			required: "Please provide a valid email.",
// 			email: "Please provide a valid email."
// 		},
// 		password: {
// 			required: "Please specify a password.",
// 			minlength: "Please specify a secure password."
// 		},
// 		state: "Please choose state",
// 		subscription: "Please choose at least one option",
// 		gender: "Please choose gender",
// 		agree: "Please accept our policy"
// 	},


// 	highlight: function (e) {
// 		$(e).closest('.form-group').removeClass('has-info').addClass('has-error');
// 	},

// 	success: function (e) {
// 		$(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
// 		$(e).remove();
// 	},

// 	errorPlacement: function (error, element) {
// 		if(element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
// 			var controls = element.closest('div[class*="col-"]');
// 			if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
// 			else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
// 		}
// 		else if(element.is('.select2')) {
// 			error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
// 		}
// 		else if(element.is('.chosen-select')) {
// 			error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
// 		}
// 		else error.insertAfter(element.parent());
// 	},

// 	submitHandler: function (form) {
// 	},
// 	invalidHandler: function (form) {
// 	}
// });