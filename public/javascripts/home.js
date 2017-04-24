$("#gritter-Regular").on('click', function(event){
	$.gritter.add({
		title: '<span class="gritter-title">This is a warning notification</span>',
		text: '<p>Just add a "gritter-light" class_name to your $.gritter.add or globally to $.gritter.options.class_name</p>',
		sticky: false,
		time: 3000,
		speed: 500,
		image: 'http://127.0.0.1:3000/images/fengjing1.jpg'
	})
});

$("#gritter-Primary").on('click', function(event){
	$.gritter.add({
		title: '<span class="gritter-title">This is a warning notification</span>',
		text: '<p>Just add a "gritter-light" class_name to your $.gritter.add or globally to $.gritter.options.class_name</p>',
		sticky: false,
		time: 3000,
		speed: 500,
		image: 'http://127.0.0.1:3000/images/fengjing1.jpg',
		class_name: 'gritter-info'
	})
});

/**
 * colorbox
 */
var $overflow = '';
var colorbox_params = {
	rel: 'colorbox',
	reposition: true,
	scalePhotos: true,
	scrolling: false,
	previous: '<i class="ace-icon fa fa-arrow-left"></i>',
	next: '<i class="ace-icon fa fa-arrow-right"></i>',
	close: '&times',
	current: '{current} of {total}',
	maxWidth: '100%',
	maxHeight: '100%',
	onOpen: function(){
		$overflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	},
	onClosed: function(){
		document.body.style.overflow = $overflow;
	},
	onComplete: function(){
		$.colorbox.resize();
	}
};

$('.ace-thumbnails [data-rel="colorbox"]').colorbox(colorbox_params);
$('#cboxLoadingGraphic').html('<i class="ace-icon fa fa-spinner orange"></i>');

/**
 * input-mask插件
 */
$.mask.definitions['~']='[+-]';
$('.input-mask-date').mask('9999/99/99');
$('.input-mask-phone').mask('(999) 999-9999');
$('.input-mask-eyescript').mask('~9.99 ~9.99 999');
$(".input-mask-product").mask("a*-999-a999",{placeholder:" ",completed:function(){alert("You typed the following: "+this.val());}});

/**
 * chosen插件
 */
$('.chosen-select').chosen({allow_single_deselect:true});
$(window)
.off('resize.chosen')
.on('resize.chosen', function() {
	$('.chosen-select').each(function() {
		 var $this = $(this);
		 $this.next().css({'width': $this.parent().width()});
		 $this.on('change', function(event){
		 	console.log(event.target.value);
		 })
	})
}).trigger('resize.chosen');
//转换多选样式
$('#chosen-multiple-style').on('click', function(e){
	var target = $(e.target).find('input[type=radio]');
	var which = parseInt(target.val());
	if(which == 2) $('#form-field-select-4').addClass('tag-input-style');
	 else $('#form-field-select-4').removeClass('tag-input-style');
});

/**
 * slider插件
 */
$( "#slider-range" ).css('height','200px').slider({
	orientation: "vertical",
	range: true,
	min: 0,
	max: 100,
	values: [ 17, 67 ],
	slide: function( event, ui ) {
		var val = ui.values[$(ui.handle).index()-1] + "";
		console.log(ui.value);
		if( !ui.handle.firstChild ) {
			$("<div class='tooltip right in' style='display:none;left:16px;top:-6px;'><div class='tooltip-arrow'></div><div class='tooltip-inner'></div></div>")
			.prependTo(ui.handle);
		}
		$(ui.handle.firstChild).show().children().eq(1).text(val);
	}
}).find('a').on('blur', function(){
	$(this.firstChild).hide();
});
$( "#slider-eq > span" ).css({width:'90%', 'float':'left', margin:'15px'}).each(function() {
	// read initial values from markup and remove that
	if($(this).text() == ''){
		$(this).text(0);
	};
	var value = parseInt( $( this ).text(), 10 );
	$( this ).empty().slider({
		value: value,
		range: "min",
		animate: true,
		slide: function(event, ui){
			// console.log(ui.value);
		}
	});
});

/**
 * spinners插件
 */
$('#spinner1').ace_spinner({
	value:20,
	min:0,
	max:200,
	step:1,
	btn_up_class:'btn-danger',
	btn_down_class:'btn-danger'
}).on('change', function(){
	console.log(this.value);
});
$('#spinner2').ace_spinner({
	value:0,
	min:0,
	max:10000,
	step:100,
	touch_spinner: true,
	icon_up:'ace-icon fa fa-caret-up',
	icon_down:'ace-icon fa fa-caret-down'
}).on('change', function(){
	console.log(this.value);
});
$('#spinner3').ace_spinner({
	value:0,
	min:-100,
	max:100,
	step:10,
	on_sides: true,
	icon_up:'ace-icon fa fa-plus smaller-75',
	icon_down:'ace-icon fa fa-minus smaller-75',
	btn_up_class:'btn-success',
	btn_down_class:'btn-danger'
});

/**
 * 日期时间拾取器
 */
$('.date-picker').datepicker({
	autoclose: true,
	todayHighlight: true
})
//show datepicker when clicking on the icon
.next().on('click', function(){
	console.log(1);
	$(this).prev().focus();
});
/*daterange，日期范围选择*/
$('.input-daterange').datepicker({autoclose:true});
/*date range picker*/
$('input[name=date-range-picker]').daterangepicker({
	'applyClass' : 'btn-sm btn-success',
	'cancelClass' : 'btn-sm btn-default',
	locale: {
		applyLabel: '确定',
		cancelLabel: '取消',
	}
})
.prev().on(ace.click_event, function(){
	$(this).next().focus();
});

/**
 * 时间拾取器
 */
$('#timepicker1').timepicker({
	minuteStep: 1,
	secondStep: 1,
	showSeconds: true,
	showMeridian: false
}).next().on('click', function(){
	$(this).prev().focus();
});

/**
 * 色彩拾取器
 */
$('#colorpicker1').colorpicker().on('blur', function(event){
	console.log(this.value);
});
/*简单颜色选择器*/
$('#simple-colorpicker-1').ace_colorpicker();
//$('#simple-colorpicker-1').ace_colorpicker('pick', 2);//select 2nd color
//$('#simple-colorpicker-1').ace_colorpicker('pick', '#fbe983');//select #fbe983 color
//var picker = $('#simple-colorpicker-1').data('ace_colorpicker')
//picker.pick('red', true);//insert the color if it doesn't exist

/**
 * knob
 */
$(".knob").knob();


/**
 * wizard
 */
$('#my-wizard')
.ace_wizard({
  //step: 2 //optional argument. wizard will jump to step "2" at first
})
.on('change' , function(e, info) {
   //info.step
   //info.direction
})
.on('finished', function(e) {
	bootbox.dialog({
		message: "Thank you! Your information was successfully saved!", 
		buttons: {
			"success" : {
				"label" : "OK",
				"className" : "btn-sm btn-primary"
			}
		}
	});
   //do something when finish button is clicked
}).on('stepclick', function(e) {
   //e.preventDefault();//this will prevent clicking and selecting steps
});
$(".wizard-actions ").on('click', 'button', function(event){
	console.log(1);
	var wizard = $('#my-wizard').data('wizard');
	if($(this).hasClass('btn-prev')){
		wizard.currentStep = wizard.currentStep == 1 ? 1 : wizard.currentStep - 1;
		wizard.setState();
	} else {
		wizard.next();
	}
})

/**
 * 验证
 */
$('#validation-form').validate({
	errorElement: 'div',
	errorClass: 'help-block',
	focusInvalid: false,
	rules: {
		email: {
			required: true,
			email:true
		},
		password: {
			required: true,
			minlength: 5
		},
		password2: {
			required: true,
			minlength: 5,
			equalTo: "#password"
		},
		name: {
			required: true
		},
		phone: {
			required: true,
			phone: 'required'
		},
		url: {
			required: true,
			url: true
		},
		comment: {
			required: true
		},
		state: {
			required: true
		},
		platform: {
			required: true
		},
		subscription: {
			required: true
		},
		gender: {
			required: true,
		},
		agree: {
			required: true,
		}
	},

	messages: {
		email: {
			required: "Please provide a valid email.",
			email: "Please provide a valid email."
		},
		password: {
			required: "Please specify a password.",
			minlength: "Please specify a secure password."
		},
		state: "Please choose state",
		subscription: "Please choose at least one option",
		gender: "Please choose gender",
		agree: "Please accept our policy"
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
	},
	invalidHandler: function (form) {
	}
});