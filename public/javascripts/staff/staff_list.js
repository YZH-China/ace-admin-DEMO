jQuery(function($){
	var checkedArray = [];

	(function(){
	    var oLanguage={
	        "oAria": {
	            "sSortAscending": ": 升序排列",
	            "sSortDescending": ": 降序排列"
	        },
	        "oPaginate": {
	            "sFirst": "首页",
	            "sLast": "末页",
	            "sNext": "下页",
	            "sPrevious": "上页"
	        },
	        "sEmptyTable": "没有相关记录",
	        "sInfo": "第 _START_ 到 _END_ 条记录，共 _TOTAL_ 条",
	        "sInfoEmpty": "第 0 到 0 条记录，共 0 条",
	        "sInfoFiltered": "(从 _MAX_ 条记录中检索)",
	        "sInfoPostFix": "",
	        "sDecimal": "",
	        "sThousands": ",",
	        "sLengthMenu": "每页显示条数: _MENU_",
	        "sLoadingRecords": "正在载入...",
	        "sProcessing": "正在载入...",
	        "sSearch": "搜索:",
	        "sSearchPlaceholder": "",
	        "sUrl": "",
	        "sZeroRecords": "没有相关记录"
	    }
	    $.fn.dataTable.defaults.oLanguage=oLanguage;
	    //$.extend($.fn.dataTable.defaults.oLanguage,oLanguage)
	})();

	/**
	 * 商品表格排序功能启用
	 */
	var myTable = $("#sample-table-2").dataTable({
		bAutoWidth: false,
		"aoColumns":[
			{"bSortable": false},
			null,null,
			{"bSortable": false}
		],
		"aaSorting":[]
	});

	/**
	 * 商品复选框全选
	 */
	$(document).on('click', 'th input:checkbox', function(){
		var that = this;
		checkedArray = [];
		$(this).closest('table').find('tr > td:first-child input:checkbox').each(function(index, el) {
			this.checked = that.checked;
			$(this).closest('tr').toggleClass('selected');
			if(that.checked){
				checkedArray.push($(this).closest('td').next('td').attr('data-id'));
			} else {
				for(var i = 0; i < checkedArray.length; i += 1){
					if(checkedArray[i] === $(this).closest('td').next('td').attr('data-id')){
						checkedArray.splice(i, 1);
						break;
					}
				}
			}
		});
		console.log(checkedArray);
	})

	/**
	 * 商品复选框单选
	 */
	$('tbody').on('click', 'td input:checkbox', function(){
		if($(this).get(0).checked){
			checkedArray.push($(this).closest('td').next('td').attr('data-id'));
		} else {
			for(var i = 0; i < checkedArray.length; i += 1){
				if(checkedArray[i] === $(this).closest('td').next('td').attr('data-id')){
					checkedArray.splice(i, 1);
					break;
				}
			}
		}
		console.log(checkedArray);
	})
})

