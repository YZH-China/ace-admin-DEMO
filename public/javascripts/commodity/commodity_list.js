jQuery(function($){
	var checkedArray = [],
		observer = {};

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

	observer = (function(){
		/**
		 * 观察者对象构造函数
		 */
		function Observer(){
			this.fns = [];
		}
		/**
		 * 绑定方法
		 */
		Observer.prototype = {
			//订阅
			subscribe: function(fn){
				this.fns.push(fn);
			},
			//退订
			unScubscribe: function(fn){
				this.fns = this.fns.filter(function(el){
					if(el !== fn){
						return el;
					}
				})
			},
			//发布
			publish: function(o, thisObj){
				var scope = thisObj || window;
				this.fns.forEach(function(fn){
					fn.call(thisObj, o);
				})
			}
		};
		/**
		 * 定义订阅处理函数
		 */
		var nextPageChange = function(data){
			var newScope = this;
			if(newScope.data === data){
				newScope.data = newScope.data;
			} else {		
				newScope.data = data;	
				newScope.data.on('click', function(e){
					//以下是点击的处理操作
					$("#sample-table-commodity th input:checkbox").get(0).checked = false;
					checkedArray = [];
					//以上是点击的处理操作
					
					setTimeout(function(e){
						$("#sample-table-commodity td input:checkbox").each(function(index, el) {
							el.checked = false;
						});
						observer.observer_nextpagechange.publish($("#sample-table-commodity_next>a"));
						observer.observer_prevpagechange.publish($("#sample-table-commodity_previous>a"));
					}, 100)
				})
			}
		};
		var prevPageChange = function(data){
			var newScope = this;
			if(newScope.data === data){
				newScope.data = newScope.data;
			} else {
				newScope.data = data;
				newScope.data.on('click', function(e){
					//以下是点击的处理操作（操作当前界面）
					$("#sample-table-commodity th input:checkbox").get(0).checked = false;
					checkedArray = [];
					//以上是点击的处理操作
					setTimeout(function(e){
						//（操作即将加载界面）
						//将即将要加载的所有checkbox状态改为false;
						$("#sample-table-commodity td input:checkbox").each(function(index, el) {
							el.checked = false;
						});
						console.log(checkedArray);
						observer.observer_nextpagechange.publish($("#sample-table-commodity_next>a"));
						observer.observer_prevpagechange.publish($("#sample-table-commodity_previous>a"));
					}, 80)
				})
			}
		};

		//实例化观察者
		var observer_nextpagechange = new Observer(),
			observer_prevpagechange = new Observer();

		//订阅函数
		observer_nextpagechange.subscribe(nextPageChange); //下一页事件
		observer_prevpagechange.subscribe(prevPageChange); //上一页事件

		//返回观察者对象
		return {
			observer_nextpagechange: observer_nextpagechange,
			observer_prevpagechange: observer_prevpagechange
		};

	}())

	/**
	 * 商品表格排序功能启用
	 */
	var myTable = $("#sample-table-commodity").dataTable({
		bAutoWidth: false,
		"aoColumns":[
			{"bSortable": false},
			null,null,null,
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

	observer.observer_prevpagechange.publish($("#sample-table-commodity_previous>a"));
	observer.observer_nextpagechange.publish($("#sample-table-commodity_next>a"));
})