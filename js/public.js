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
	proxy: 'http://104.194.94.3:3003/bookcircle/',
	url2 : "http://172.20.10.3:3002/bookcircle/",
	phoneReg: /^1[3|4|5|8][0-9]\d{4,8}$/,
}

var api = {
	userRegister: config.url + "user/register",
	userLogin: config.url + "user/login",
	userOffline: config.url + "user/offline",
	userUpdate: config.url + "user/update",
	userSearch: config.url + "user/search",
	userGet: config.url + "user/get",
	bookSearch: config.proxy + "book/search",
	bookIsbn: config.url + "book/isbn",
	bookNew_home: config.url + "book/new?pageIndex=1",
	bookHot_home: config.url + "book/hot?pageIndex=1",
	bookRecommend: config.url + "book/recommend",
	bookNew: config.url + "book/new",
	bookHot: config.url + "book/hot",
	bookStoreup: config.url + "userbook/storeup",
	bookUnstore: config.url + "userbook/unstore",
	bookStoreList: config.url + "userbook/mybooks",
	followers: config.url + "friend/fans",
	following: config.url + "friend/friends",
	relationship: config.url + "friend/relationship",
	feekback: config.url + "feedback/publish",
	follow:config.url + "friend/follow",
	unfollow:config.url + "friend/unfollow",
	dynamicPublish:config.url + "dynamic/publish",
	dynamicInfos:config.url + "dynamic/infos",
	dynamicAll:config.url + "dynamic/all",
	dynamicFriends: config.url + "dynamic/friends",
	dynamicLike:config.url + "dynamic/like",
	commentBook:config.url + "dynamic/book",
	commentInfos:config.url + "comment/infos",
	commentPublish:config.url + "comment/publish",
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

//	console.log("窗口标识: " + ws.id);
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

//打开新窗口
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

//点击打开新窗口
function openBookDetail() {
	mui('body').on('tap', ".book-detail", function(e) {
		var tohref = "book-detail.html";
		var key = this.getAttribute('data-key');
		var length = tohref.split("/").length;
		var urlid = tohref.split("/")[length - 1];
		console.log("openBookDetail=====>" + urlid, tohref);
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
				key: key
			},
			waiting: {
				autoShow: true
			}
		});
	});
}


//点击打开新窗口
function openAccountDetail() {
	mui('body').on('tap', ".account-detail", function(e) {
		var tohref = "account.html";
		var key = this.getAttribute('data-key');
		var length = tohref.split("/").length;
		var urlid = tohref.split("/")[length - 1];
		console.log("openAccountDetail=====>" + urlid, tohref);
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
				key: key
			},
			createNew:true,
			waiting: {
				autoShow: true
			}
		});
	});
}

//点击打开新窗口
function openCircleDetail() {
	mui('body').on('tap', ".circle-detail", function(e) {
		var tohref = "circle-detail.html";
		var key = this.getAttribute('data-key');
		var length = tohref.split("/").length;
		var urlid = tohref.split("/")[length - 1];
		console.log("openCircleDetail=====>" + urlid, tohref);
		mui.openWindow({
			id: urlid,
			url: tohref,
			styles: {
				popGesture: "close"
			},
			show: {
				autoshow: false,
				aniShow: "zoom-fade-out"
			},
			extras: {
				key: key
			},
			waiting: {
				autoShow: true
			}
		});
	});
}

function rate(rating) {
	if(!rating){
		return '<i class="mui-icon mui-icon-star"></i><i class="mui-icon mui-icon-star"></i><i class="mui-icon mui-icon-star"></i><i class="mui-icon mui-icon-star"></i><i class="mui-icon mui-icon-star"></i>';
	}
	var renderHTML = "";
	var str = rating / 2 + "";
	var arr = str.split('.');
	//int
	if(arr.length == 1) {
		for(var i = 0; i < parseInt(arr[0]); i++) {
			renderHTML += '<i class="mui-icon mui-icon-star-filled"></i>';
		}
		for(var j = 0; j < 5 - parseInt(arr[0]); j++) {
			renderHTML += '<i class="mui-icon mui-icon-star"></i>';
		}
		renderHTML  = renderHTML + rating + ".0";
	}else if(arr.length == 2){
		for(var i = 0; i < parseInt(arr[0]); i++) {
			renderHTML += '<i class="mui-icon mui-icon-star-filled"></i>';
		}
			renderHTML += '<i class="mui-icon mui-icon-starhalf"></i>';
		for(var m = 0; m < 4 - i; m++) {
			renderHTML += '<i class="mui-icon mui-icon-star"></i>';
		}
		renderHTML = renderHTML + " "+ rating; 
	}
	return renderHTML;
}
//下拉刷新 上拉加载
function pullrefreshInit(url, callback, flag) { 
	
	switch (flag){
		//0 表示上拉加载和下拉刷新都需要初始化
		case 0:
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "加载中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						callback: pulldownRefresh
					},
					up: {
						auto: false, //可选,默认false.自动上拉加载一次
						contentrefresh: '加载中...',
						contentnomore: '我也是有底线的', //可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: pullupRefresh
					}
				}
			});
			break;
		//1 表示只初始化上拉加载
		case 1:
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					up: {
						auto: false, //可选,默认false.自动上拉加载一次
						contentrefresh: '加载中...',
						contentnomore: '我也是有底线的', //可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: pullupRefresh
					}
				}
			});
			break;
		
	}
	
	
	
	
	//初始化翻页参数
	var pageIndex = 1;
	var upRefreshFlag = true;//上拉加载标志位。为true则执行刷新
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		pageIndex = 1;
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
			if(upRefreshFlag) {
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
		console.log(url+"&pageIndex="+pageNo);
		mui.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {
				pageIndex : pageNo,
			},
			success: function(data) {
				console.log(data)
				if(data.errorCode != 0) {
					mui.alert(data.errorMsg, "出错啦...");
					return;
				}
				
				if(callback instanceof Function) {
					
					//当数据少于10条时，结束上拉加载
					if(data.data.length < 10){
						upRefreshFlag = false;
					}
					callback(data.data, isRefresh);
					pageIndex++;
				}

			},
			error: function(err) {
				mui.toast("访问出错啦")
			},
			beforeSend: function() {},
			complete: function() {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(!upRefreshFlag);
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
			console.log(JSON.stringify(data));
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
	console.log(JSON.stringify(data));
	mui.ajax({
		url: url,
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			console.log(JSON.stringify(data));
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
			console.log(JSON.stringify(data));
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