jQuery(function($) {

	var grid_selector = "#commodity_list";
	var pager_selector = "#commodity_page";
	var originalData = [];
	var newCommodity = {};
	var lastSelect = null;
	var updateData = {
		id: '',
		name: '',
		price: '',
		beingsold: ''
	}

	//resize to fit page size
	$(window).on('resize.jqGrid', function () {
		jQuery(grid_selector).jqGrid( 'setGridWidth', $(".page-content").width() );
    })
	//resize on sidebar collapse/expand
	var parent_column = $(grid_selector).closest('[class*="col-"]');
	$(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
		if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
			//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
			setTimeout(function() {
				$(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
			}, 0);
		}
    })

    jQuery(grid_selector).jqGrid({
    	datatype: "json",
		url: '/commodity/getCommoditiesByPage',
		mtype: 'POST',
        loadonce: false,
        prmNames: {page:"currentPage", rows:null, sort: null,order: null, search: null, nd: null, npage:null},
        jsonReader: {
	    	root: function(obj){
				originalData = obj.rows;
	    		return obj.rows;
	    	},
	    	page: function(obj){
	    		return obj.currentPage;
	    	},
	    	total: function(obj){
	    		return obj.pageCount;
	    	},
	    	records: function(obj){
	    		return obj.rowCount
	    	},
	    	repeatitems: false
	    },
		height: 390,
		colNames:[' ', 'ID','商品名', '单价', '状态'],
		colModel:[
			{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
				formatter:'actions', 
				formatoptions:{ 
					keys:true,
					// delbutton: false,//disable delete button
					editbutton: true,
					delformbutton: true,
					delOptions:{
						recreateForm: true,
						beforeShowForm:beforeDeleteCallback,
						url: '/commodity/deleteOne',
						mtype: 'POST',
						afterSubmit: function(xhr, postdata){
							var callbackData = JSON.parse(xhr.responseText);
							if(callbackData){
								return [true, '删除成功！']
							} else {
								return [false, '刪除失败！']
							}
							jQuery(grid_selector).trigger('reloadGrid');
						},
						serializeDelData: function(postdata){
							delete postdata.oper;
							return postdata;
						}
					},
					editformbutton:true,
					editOptions:{
						recreateForm: true,
						beforeShowForm:beforeEditCallback,
						closeAfterEdit: true,
						url: '/commodity/updateOne',
						mtype: 'POST',
						afterSubmit: function(xhr, postdata){
							var callbackData = JSON.parse(xhr.responseText);
							if(callbackData.affectedRows !== 1){
								return [ false, '由于未知原因修改失败！']
							} else {
								return [ true, '修改成功！']
							}
							
						},
						serializeEditData: function(postdata){
							delete postdata.oper;
							return postdata;
						},
						onclickSubmit: function(params){
							console.log(params);
						},
						afterclickPgButtons: function(btnType, form, rowid){
							var curBeingsold = 0;
							for(var i = 0; i < originalData.length; i += 1){
								if(~~originalData[i].id === ~~rowid){
									curBeingsold = originalData[i].beingsold;
									break;
								}
							}
							pgBtnChangeState(curBeingsold, form);
						}
					}
				}
			},   
			{ 
				name:'id',index:'id', width:60, sortable: false, sorttype:"int", key:true
			},
			{ 
				name: 'name', index: 'name', width: 100, sortable: false, editable: true, editoptions:{size:"20",maxlength:"30"},
				editrules: {
					required: true,
					// custom: true, //允许自定义
					// custom_func: function(value, name){
					// 	console.log(value, name);
					// 	return ['false', name + '是必要的！'];
					// }
				}
			},
			{
				name: 'price', index: 'price', width: 100, sortable: false, editable: true, formatter: 'currency', formatoptions: {prefix: '¥'},
				editrules: {
					required: true,
					number: true,
					minValue: 0
				}
			},
			// {name:'sdate',index:'sdate',width:90, editable:true, sorttype:"date",unformat: pickDate},
			{
				name:'beingsold',index:'beingsold', editable: true, edittype:"checkbox",editoptions: {value:"1:0"}, unformat: aceSwitch, formatter: showBeingSold
			}
			// {name:'ship',index:'ship', width:90, editable: true,edittype:"select",editoptions:{value:"FE:FedEx;IN:InTime;TN:TNT;AR:ARAMEX"}},
			// {name:'note',index:'note', width:150, sortable:false,editable: true,edittype:"textarea", editoptions:{rows:"2",cols:"10"}} 
		],
		viewrecords : true,
		rowNum:10,
		// rowList:[10,20,30],
		pager : pager_selector,
		altRows: true,
		// toppager: true,
		
		multiselect: false,
		// multikey: "ctrlKey",
        multiboxonly: true,

		loadComplete : function(data) {
			var table = this;
			$('.tooltip').css('display', 'none');
			setTimeout(function(){
				styleCheckbox(table);
				
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		// ajaxRowOptions: {
		// 	url: '/commodity/updateOne',
		// 	mtype: 'POST',
		// 	// data: {
		// 	// 	id: function(){
		// 	// 		console.log($(grid_selector).find('tbody tr[editable="1"]'))
		// 	// 		return 1;
		// 	// 	},
		// 	// 	name: '商品1',
		// 	// 	beingsold: '0',
		// 	// 	price: '123'
		// 	// },
		// 	success: function(data){
		// 		jQuery(grid_selector).trigger('reloadGrid');
		// 	}
		// },
		// // onSelectRow: function(rowid) {
		// // 	// var currentRow = jQuery(grid_selector).jqGrid('getRowData', rowid);
		// // 	// console.log($("#jCancelButton_1"), $("#jEditButton_1"))
		// // 	if(editState && !editInit){
		// // 		$("#jCancelButton_" + lastSelect.id).trigger('click');
		// // 	} else if(editState && editInit) {
		// // 		console.log(2);
		// // 		editInit = false;
		// // 	} else {
		// // 		return;
		// // 	}
		// // },
		// gridComplete: function() {
		// 	for(var i = 0; i < originalData.length; i += 1){
		// 		(function(i){
		// 			$("#jEditButton_" + originalData[i].id).get(0).onclick = function(e){
		// 				jQuery.fn.fmatter.rowactions.call(this,'edit');
		// 				setTimeout(function(){
		// 					$("#"+ originalData[i].id +"_beingsold").on('click', function(){
		// 						if(this.checked) {
		// 							updateData.beingsold = '1';
		// 						}
		// 						else {
		// 							updateData.beingsold = '0';
		// 						}
		// 					})
		// 				}, 200)
		// 			};
		// 			$("#jSaveButton_" + originalData[i].id).get(0).onclick = function(e){
		// 				var event = e || window.event;
		// 				var firstTd = $(this).parents('td[aria-describedby="commodity_list_myac"]');
		// 				updateData.id = firstTd.nextAll('td[aria-describedby="commodity_list_id"]').text();
		// 				updateData.name = firstTd.nextAll('td[aria-describedby="commodity_list_name"]').find('input[name="name"]').val();
		// 				updateData.price = firstTd.nextAll('td[aria-describedby="commodity_list_price"]').find('input[name="price"]').val();
		// 				updateData.beingsold = $("#"+ originalData[i].id +"_beingsold").get(0).checked	? '1' : '0';	
		// 				console.log(updateData);
		// 				jQuery(grid_selector).jqGrid('setGridParam', {
		// 					ajaxRowOptions: {
		// 						url: '/commodity/updateOne',
		// 						mtype: 'POST',
		// 						data: updateData,
		// 						success: function(data){
		// 							jQuery(grid_selector).trigger('reloadGrid');
		// 						}
		// 					}
		// 				})
		// 				jQuery.fn.fmatter.rowactions.call(this,'save');
		// 			}
		// 		}(i))
		// 	}
		// },
		serializeEditData: function(postdata){
			console.log(postdata);
		},
		editurl: "/commodity/updateOne",//nothing is saved
		caption: "商品"
    })

    $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size

    //switch element when editing inline
	function aceSwitch( cellvalue, options, cell ) {
		setTimeout(function(){
			if(cellvalue === '未授权') {
				$(cell) .find('input[type=checkbox]')
				.addClass('ace ace-switch ace-switch-5')
				.after('<span class="lbl"></span>');
			} else if(cellvalue === '已授权'){
				$(cell) .find('input[type=checkbox]').attr('checked', true)
				.addClass('ace ace-switch ace-switch-5')
				.after('<span class="lbl"></span>');
			}
		}, 0);
	}
	//enable datepicker
	function pickDate( cellvalue, options, cell ) {
		setTimeout(function(){
			$(cell) .find('input[type=text]')
					.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
		}, 0);
	}

	//navButtons
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: false,
			editicon : 'ace-icon fa fa-pencil blue',
			add: true,
			addicon : 'ace-icon fa fa-plus-circle purple',
			del: false,
			delicon : 'ace-icon fa fa-trash-o red',
			search: true,
			searchicon : 'ace-icon fa fa-search orange',
			refresh: true,
			refreshicon : 'ace-icon fa fa-refresh green',
			view: true,
			viewicon : 'ace-icon fa fa-search-plus grey',

		},
		{
			//edit record form
			//closeAfterEdit: true,
			//width: 700,
			recreateForm: true,
			url: '/staff/editOne',
			mtype: 'POST',
			editformbutton: true,
			eidtData: {
				JSID: function() {
					var jsid = $(grid_selector).jqGrid('getGridParam', 'selrow');
					var value = $(grid_selector).jqGrid('getRowData', jsid);
					console.log(value);
					return value.id;
				}
			},
			beforeShowForm: function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit: function(xhr, postdata){
				var callbackData = JSON.parse(xhr.responseText);
				if(callbackData.insertId){
					return [true, 'message'];
				} else {
					return [false, 'message'];
				}
			}
		},
		{
			//new record form
			width: 700,
			closeAfterAdd: true,
			recreateForm: false,
			viewPagerButtons: false,
			ajaxEditOptions: {
				url: '/commodity/addNewOne',
				mtype: 'POST',
				data: {},
				success: function(data){
					console.log(data);
				}
			},
			beforeShowForm : function(e) {
				// console.log($(grid_selector).jqGrid('getGridParam', 'caption'));
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
				.wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			// afterSubmit: function(xhr, postdata){
			// 	console.log(xhr, postdata);
			// },
			// beforeSubmit: function(postData, formid){
			// 	newCommodity = postData;
			// 	return [true, ''];
			// }
			onclickSubmit: function(params, postdata){
				var attributeArr = ['beingsold', 'name', 'price'];
				for(var i = 0; i < attributeArr.length; i += 1){
					newCommodity[attributeArr[i]] = postdata[attributeArr[i]]
				}
				params.ajaxEditOptions.data = newCommodity;
			}
		},
		{
			//delete record form
			recreateForm: true,
			url: '/staff/deleteOne',
			mtype: 'POST',
			delData: {
				name: function(){
					var jsid = $(grid_selector).jqGrid('getGridParam', 'selrow');
					var value = $(grid_selector).jqGrid('getRowData', jsid);
					return value.name;
				}
			},
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;
				
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);
				
				form.data('styled', true);
			}
		},
		{
			//search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,
			/**
			multipleGroup:true,
			showQuery: true
			*/
		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		},
		{multipleSearch:true}
	)

	function style_edit_form(form) {
		//enable datepicker on "sdate" field and switches for "stock" field
		// form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
		// 	.end().find('input[name=stock]')
		// 		.addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
				   //don't wrap inside a label element, the checkbox value won't be submitted (POST'ed)
				  //.addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');
		var rowid = jQuery(grid_selector).jqGrid('getGridParam', 'selrow');
		var curBeingsold = 0;
		for(var i = 0; i < originalData.length; i += 1){
			if(~~originalData[i].id === ~~rowid){	
				curBeingsold = originalData[i].beingsold;
				break;
			}
		}
		//给beingsold字段启用switch样式，根据当前行的原始数据来确定状态
		if(curBeingsold == 0){
			form.find('input[name="beingsold"]').addClass('ace ace-switch ace-switch-5').attr('checked', false).after('<span class="lbl"></span>');
		} else {
			form.find('input[name="beingsold"]').addClass('ace ace-switch ace-switch-5').attr('checked', true).after('<span class="lbl"></span>')
		}
		//update buttons classes
		var buttons = form.next().find('.EditButton .fm-button');
		buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();//ui-icon, s-icon
		buttons.eq(0).addClass('btn-primary').prepend('<i class="ace-icon fa fa-check"></i>');
		buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>')
		
		buttons = form.next().find('.navButton a');
		buttons.find('.ui-icon').hide();
		buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
		buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');
	}

	function style_delete_form(form) {
		var buttons = form.next().find('.EditButton .fm-button');
		buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
		buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
		buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
	}
	
	function style_search_filters(form) {
		form.find('.delete-rule').val('X');
		form.find('.add-rule').addClass('btn btn-xs btn-primary');
		form.find('.add-group').addClass('btn btn-xs btn-success');
		form.find('.delete-group').addClass('btn btn-xs btn-danger');
	}
	function style_search_form(form) {
		var dialog = form.closest('.ui-jqdialog');
		var buttons = dialog.find('.EditTable')
		buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
		buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
		buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
	}
	
	function beforeDeleteCallback(e) {
		var form = $(e[0]);
		if(form.data('styled')) return false;
		
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
		style_delete_form(form);
		
		form.data('styled', true);
	}
	
	function beforeEditCallback(e) {
		var form = $(e[0]);
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
		style_edit_form(form);
	}



	//it causes some flicker when reloading or navigating grid
	//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
	//or go back to default browser checkbox styles for the grid
	function styleCheckbox(table) {
	
		$(table).find('input:checkbox').addClass('ace')
		.wrap('<label />')
		.after('<span class="lbl align-top" />')


		$('.ui-jqgrid-labels th[id*="_cb"]:first-child')
		.find('input.cbox[type=checkbox]').addClass('ace')
		.wrap('<label />').after('<span class="lbl align-top" />');
	
	}
	

	//unlike navButtons icons, action icons in rows seem to be hard-coded
	//you can change them like this in here if you want
	function updateActionIcons(table) {
		
		var replacement = 
		{
			'ui-ace-icon fa fa-pencil' : 'ace-icon fa fa-pencil blue',
			'ui-ace-icon fa fa-trash-o' : 'ace-icon fa fa-trash-o red',
			'ui-icon-disk' : 'ace-icon fa fa-check green',
			'ui-icon-cancel' : 'ace-icon fa fa-times red'
		};
		$(table).find('.ui-pg-div span.ui-icon').each(function(){
			var icon = $(this);
			var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
			if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
		})
		
	}
	
	//replace icons with FontAwesome icons like above
	function updatePagerIcons(table) {
		var replacement = 
		{
			'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
			'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
			'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
			'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
		};
		$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
			var icon = $(this);
			var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
			
			if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
		})
	}

	function enableTooltips(table) {
		jQuery('.navtable .ui-pg-button').tooltip({container:'body'});
		jQuery(table).find('.ui-pg-div').tooltip({container:'body'});
	}

	//根据beingsold显示内容
	function showBeingSold(cellvalue, options, rowObject){
		var rowOriginalData = {};
		var temp = '<span class="';
		if(rowObject.id){
			//是初始化，根据cellvalue处理
			if(cellvalue === 0){
				temp += 'label label-danger arrowed-right">未授权</span>';
			} else {
				temp += 'label label-success arrowed-right">已授权</span>';
			}
			return temp;
		} else {
			//不是初始化，cellvalue是一个label控件
			return cellvalue;
		}	
	}

	//表单编辑时，根据当前行的状态改变现实样式
	function pgBtnChangeState(curBeingsold, form){
		var inputBeingsold = form.find('input[name="beingsold"]');
		var lastState = inputBeingsold.attr('checked');
		if(curBeingsold === 0 && lastState){
			inputBeingsold.trigger('click');
			// inputBeingsold.attr('checked', false);
			return;
		}
		if(curBeingsold === 1 && !lastState){
			inputBeingsold.trigger('click');
			// inputBeingsold.attr('checked', true);
			return;
		}
		
	}

	$(document).on({
		ajaxloadstart: function(e) {
			$(grid_selector).jqGrid('GridUnload');
			$('.ui-jqdialog').remove();
		}
	})

})