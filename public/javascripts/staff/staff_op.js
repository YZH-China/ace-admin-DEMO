jQuery(function($) {
	var testData = [];
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";
	var ids = [];
	var queryData = {
		name: '张',
		currentPage: 1
	};

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
		data: {},
		url: '/staff/getStaffsGridByPage',
		mtype: 'POST',
        loadonce: false,
        prmNames: {page:"currentPage", rows:null, sort: null,order: null, search: null, nd: null, npage:null},

        // ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        // serializeGridData: function (postData) {
        //     return JSON.stringify(postData);
        // },
        jsonReader: {
	    	root: function(obj){
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
		colNames:['', 'ID','姓名'],
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
						url: '/staff/deleteOne',
						mtype: 'POST',
						delData: {
							name: function(){
								var jsid = $(grid_selector).jqGrid('getGridParam', 'selrow');
								var value = $(grid_selector).jqGrid('getRowData', jsid);
								return value.name;
							}
						},
						afterSubmit: function(xhr, postdata){
							console.log(xhr, postdata);
							var callbackData = JSON.parse(xhr.responseText);
							if(callbackData.affectedRows !== 1){
								return [false, '刪除失败']
							} else {
								return [true, 'message']
							}
							
						}
					},
					editformbutton:true,
					editOptions:{
						recreateForm: true,
						beforeShowForm:beforeEditCallback,
					}
				}
			},
			{name:'id',index:'id', width:60, sorttype:"int", key:true},
			{name: 'name', index: 'name', width: 100, editable: true, editoptions:{size:"20",maxlength:"30"}}
			// {name:'sdate',index:'sdate',width:90, editable:true, sorttype:"date",unformat: pickDate},
			// {name:'name',index:'name', width:150,editable: true,editoptions:{size:"20",maxlength:"30"}},
			// {name:'stock',index:'stock', width:70, editable: true,edittype:"checkbox",editoptions: {value:"Yes:No"},unformat: aceSwitch},
			// {name:'ship',index:'ship', width:90, editable: true,edittype:"select",editoptions:{value:"FE:FedEx;IN:InTime;TN:TNT;AR:ARAMEX"}},
			// {name:'note',index:'note', width:150, sortable:false,editable: true,edittype:"textarea", editoptions:{rows:"2",cols:"10"}} 
		],

		viewrecords : true,
		rowNum:10,
		// rowList:[10,20,30],
		pager : pager_selector,
		altRows: true,
		// toppager: true,
		
		multiselect: true,
		// multikey: "ctrlKey",
        multiboxonly: true,

		loadComplete : function() {
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		// onSelectRow: function(rowid, status){
		// 	// console.log(rowid, status);
		// 	var rowData = $(grid_selector).jqGrid('getRowData', rowid);
		// 	console.log(rowData);
		// 	//getDataIDs
		// 	console.log($(grid_selector).jqGrid('getGridParam', 'selarrrow'));
		// },
		// loadBeforeSend: function(xhr, settings){
		// 	var data = null;
		// 	if(settings.data){
		// 		data = JSON.parse(settings.data);
		// 		if(data._search){
		// 			settings.url = '/staff/search';
		// 		}
		// 		if(data.sidx && data.sidx !== ''){
		// 			settings.url = '/staff/sort';
		// 		}
		// 	}
		// },
		gridComplete: function(){
			queryData.currentPage = $(grid_selector).jqGrid('getGridParam', 'page');
		},

		editurl: "/staff/editOne",//nothing is saved
		caption: "jqGrid 学习"

	});

	$(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size

	//enable search/filter toolbar
	//jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})
	//jQuery(grid_selector).filterToolbar({});


	//switch element when editing inline
	function aceSwitch( cellvalue, options, cell ) {
		setTimeout(function(){
			$(cell) .find('input[type=checkbox]')
				.addClass('ace ace-switch ace-switch-5')
				.after('<span class="lbl"></span>');
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
			viewicon : 'ace-icon fa fa-search-plus grey'
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
			//width: 700,
			closeAfterAdd: true,
			recreateForm: false,
			viewPagerButtons: false,
			url: '/staff/addNewOne',
			mtype: 'POST',
			beforeShowForm : function(e) {
				// console.log($(grid_selector).jqGrid('getGridParam', 'caption'));
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
				.wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			},
			afterSubmit: function(xhr, postdata){
				console.log(xhr, postdata);
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

	addAllEvent();
	
	function style_edit_form(form) {
		//enable datepicker on "sdate" field and switches for "stock" field
		form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
			.end().find('input[name=stock]')
				.addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
				   //don't wrap inside a label element, the checkbox value won't be submitted (POST'ed)
				  //.addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

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

	function addFunc(){
		var form = $(e[0]);
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
		.wrapInner('<div class="widget-header" />')
		style_edit_form(form);
	}

	function addAllEvent(){
		$("#form-field-name").on({
			change: nameHandle
		});
		$("#form-btn-query").on({
			click: queryBtnHandle
		})
	}

	function nameHandle(event){
		queryData.name = $("#form-field-name").val();
		console.log(queryData);
	}
	function queryBtnHandle(event){
		jQuery(grid_selector).jqGrid('setGridParam', {
			page: 1
		});
		jQuery(grid_selector).jqGrid('setGridParam', {
			url: '/staff/query',
			postData: {name:queryData.name, currentPage: jQuery(grid_selector).jqGrid('getGridParam', 'page')}
		}).trigger("reloadGrid");
	}

	//var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

	$(document).on('ajaxloadstart', function(e) {
		$(grid_selector).jqGrid('GridUnload');
		$('.ui-jqdialog').remove();
	});
});