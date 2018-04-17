mui.init({
	statusBarBackground: '#f1f1ed',
//	statusBarBackground: '#fff',
	
	keyEventBind: {
		backbutton: true //默认打卡安卓手机back按键监听
	},
	gestureConfig: {
		doubletap: true
	}
});

var config = {
	url: 'http://104.194.94.3:3002/bookcircle/',
	phoneReg: /^1[3|4|5|8][0-9]\d{4,8}$/,
}

var api = {
	userRegister : config.url + "user/register",
	userLogin : config.url + "user/login",
	userUpdate : config.url + "user/update",
}


// 产生一个随机数
function getUid() {
	return Math.floor(Math.random() * 100000000 + 10000000).toString();
}

mui.plusReady(function() {
//	mui('body').on('tap', '.mui-icon-closeempty', function() {
//		document.body.removeChild(document.getElementsByClassName('mui-popup')[0]);
//		document.body.removeChild(document.getElementsByClassName('mui-popup-backdrop')[0]);
//		plus.webview.currentWebview().reload();
//	})

	var ws = plus.webview.currentWebview();
	//没用，必须重写mui.back方法，虽然会触发，但还是会执行mui.back方法
	//	if(document.querySelector('.mui-action-back')) {
	//		document.querySelector('.mui-action-back').addEventListener('tap', function() {
	//			if(this.getAttribute('data-hide')){
	//				console.log("?????"+ws.id);
	////				ws.hide("slide-out-right");
	////				plus.webview.hide(ws, "slide-in-right", 300);
	//			}else{
	//				ws.close("slide-out-right", 300);
	//			}
	////			var refreshId = this.getAttribute('data-refresh');
	////			if(refreshId){
	////				mui.fire(plus.webview.getWebviewById(refreshId), "refresh",{
	////					
	////				});
	////			}
	//		});
	//	}

	console.log("窗口标识: " + ws.id);
	document.addEventListener("netchange", function() {
		var network = plus.networkinfo.getCurrentType();
		if(network == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('您的网络已断开', undefined, '知道了');
			//无网1
			//流量6
			//wifi3
		} else if(network > 3) {
			plus.nativeUI.toast('网络已从wifi切换到蜂窝，浏览会产生流量', undefined, '知道了');
		} else if(network == 3) {
			mui.toast("wifi网络正常");
		}
	});
})

//点击打开窗口,针对一些页面不经常变化的页面
function atap() {
	mui('body').on('tap', ".jump", function(e) {
		var href = this.getAttribute('href');
		if(href && href != "" && href.indexOf("html") < 0) {
			//a标签打开新普通页面，不写.html是为了提醒自己不是a跳转
			var tohref = href + ".html";
			var length = tohref.split("/").length;
			var urlid = tohref.split("/")[length - 1];
			var temp = plus.webview.getWebviewById(urlid);
			console.log("哈哈哈" + urlid + temp);
			if(temp != null) {
				plus.webview.show(temp, "slide-in-right", 300);
				if(this.getAttribute('data-refresh')) {
					mui.fire(temp, 'windowrefresh');
				}
			} else if(temp == null) {
				var key = this.getAttribute('data-key');
				var length = tohref.split("/").length;
				var urlid = tohref.split("/")[length - 1];
				mui.openWindow({
					url: tohref,
					id: urlid,
					extras: {
						key: key
					}
				});
			}
		} else {
			return;
		}
	});
}
//点击打开新窗口
function openNewWindow() {
	mui('body').on('tap', ".jumpnew", function(e) {
		var href = this.getAttribute('href');
		var tohref = href + ".html";
		var key = this.getAttribute('data-key');
		var title = this.getAttribute('data-title');
		var length = tohref.split("/").length;
		var urlid = tohref.split("/")[length - 1];
		console.log("openNewWindow=====>" + urlid, tohref);
		mui.openWindow({
			id: urlid,
			url: tohref,
			styles: {
				popGesture: "close"
			},
			show: {
				autoshow: false,
				aniShow: "slide-in-right"
			},
			extras: {
				key: key,
				title: title
			},
			waiting: {
				autoShow: true
			}
		});
	});
}

function openWindow(href, attr) {
	var aniShow = "slide-in-right"; //默认slide-in-right,pop-in
	var tohref = href + ".html";
	var length = tohref.split("/").length;
	var urlid = tohref.split("/")[length - 1];
	mui.openWindow({
		url: tohref,
		id: urlid,
		extras: attr,
		show: {
			autoshow: false,
			aniShow: aniShow,
			duration:200
		},
		waiting: {
			autoShow: true
		}
	});
}

//下拉刷新 上拉加载
function pullrefreshInit(url, callback) { 
	
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback: pulldownRefresh
			},
			up: {
				auto: false, //可选,默认false.自动上拉加载一次
				contentrefresh: '正在刷新...',
				contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: pullupRefresh
			}
		}
	});
	
	//初始化翻页参数
//	var pageIndex = 1;
	var pageIndex = 0;
	var totalnum = -1; //列表当前个数
	var totalall = 0; //列表总个数
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		//		mui.toast("正在更新数据");
//		pageIndex = 1;
		pageIndex = 0;
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			mui('#pullrefresh').pullRefresh().refresh(true);
			getListByCallindex(url, pageIndex, callback, true);
		}, 300);
	}

	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			if(totalnum < totalall) {
				getListByCallindex(url, pageIndex, callback, false);
			}
		}, 300);
	}
	if(mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			}, 300);
		});
	} else {
		mui.ready(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
	}

	//请求列表接口

	function getListByCallindex(url, pageNo, callback, isRefresh) { 
		var scroll_list = [];
		var scroll_url = config.url + url;
		console.log(scroll_url);
//		console.log(scroll_url+"userId="+window.localStorage.getItem('userId')+"&pageNo="+pageNo+"&pageSize=10");
		console.log(scroll_url+"&userId="+window.localStorage.getItem('userId')+"&start="+pageNo+"&count=10");
//		var self = plus.webview.currentWebview();
//		var id = self.key;
//		if(id) {
//			scroll_url=scroll_url+"id=" + id;
//		}
		mui.ajax({
			url: scroll_url,
			type: 'get',
			dataType: 'json',
			data: {
				//				userId:"w8vhr8nqtdpb",
//				pageNo: pageNo,
//				pageSize: 10,
				start:pageNo,
				count:10,
//				userId: window.localStorage.getItem('userId')
			},
			success: function(data) {
				console.log(data)
				if(callback instanceof Function) {
					callback(null, data.books, isRefresh,data);
					pageIndex++;
				}
//				if(data.success) {
//					var data = data.result;
//					totalall = data.total;
//					scroll_list = data.list;
//					totalnum = (pageNo - 1) * 10 + scroll_list.length;
//					if(callback instanceof Function) {
//						callback(null, scroll_list, isRefresh);
//						pageIndex++;
//					}
//				} else {
//					//接口报错
//					callback("接口出错啦~");
//				}
			},
			error: function(err) {
				mui.toast("访问出错啦")
			},
			beforeSend: function() {},
			complete: function() {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(totalnum == totalall);
			}
		})
	}
}
//根据列表id获取详情页信息
function getDetailById(url, id, callback) {
	var detail = null;
	var detail_url = config.url + url;
	console.log(detail_url + "?id=" + id + "&userId=" + window.localStorage.getItem('userId'))
	mui.ajax({
		url: detail_url,
		type: 'get',
		dataType: 'json',
		data: {
			id: id,
			//	userId:"w8vhr8nqtdpb"
			userId: window.localStorage.getItem('userId')
		},
		success: function(data) {
			console.log(data)
			if(data.success) {
				detail = data.result;
				if(callback instanceof Function) {
					callback(null, detail);
				}
			} else {
				mui.toast("接口出错啦")
			}
		},
		error: function(err) {
			mui.toast("访问出错啦")
		},
		beforeSend: function() {
			plus.nativeUI.showWaiting('等待中');
		},
		complete: function() {
			plus.nativeUI.closeWaiting();
		}
	})
}
//ajax post
function muiPost(url, data, callback) {
	console.log("ajax:post====>" + url);	
	mui.ajax({
		url: url,
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if(callback instanceof Function) {
				callback(data);
			}
		},
		error: function(err) {
			mui.toast("访问出错啦")
		},
		beforeSend: function() {
			//			plus.nativeUI.showWaiting('等待中');
		},
		complete: function() {
			//			plus.nativeUI.closeWaiting();
		}
	})
}
//ajax get
function muiGet(url, callback) {
	console.log("ajax:get====>" + url);	
	mui.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if(callback instanceof Function) {
				callback(data);
			}
		},
		error: function(err) {
			mui.toast("访问出错啦")
		},
		beforeSend: function() {
			//			plus.nativeUI.showWaiting('等待中');
		},
		complete: function() {
			//			plus.nativeUI.closeWaiting();
		}
	})
}
//详情页图片宽度撑满
function setImgWhole(parentSelector) {
	var imglist = document.querySelectorAll(parentSelector + ' img');
	var inputImglist = document.querySelectorAll(parentSelector + ' input[type="image"]');
	var len = imglist.length;
	for(var i = 0; i < len; i++) {
		imglist[i].style.width = '100%';
		imglist[i].style.height = 'auto';
	}
	var inlen = inputImglist.length;
	for(var j = 0; j < inlen; j++) {
		inputImglist[j].style.width = '100%';
		inputImglist[j].style.height = 'auto';
	}
}