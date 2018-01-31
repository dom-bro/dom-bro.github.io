"use strict";

(function () {
	'use strict';

	var watchedFiles = [
	//"views/mobile/student/common/activity/local_test.html",		// 本地测试中转页
	//"views/mobile/student/common/activity/mother_day_2017",		// 母亲节html
	//"static/mobile/student/js/activity/mother_day_2017",		// 母亲节js
	//"static/mobile/student/css/activity/mother_day_2017/css/index.css", // 母亲节css
	//"views/mobile/student/wonderland",								// 自学乐园html
	//"static/mobile/student/css/wonderland/css",						// 自学乐园css
	//"static/mobile/student/js/wonderland",							// 自学乐园js
	//"views/mobile/student/common/activity/guide_pay_20170525",
	//"static/mobile/student/css/activity/guide_pay_20170628/css",
	//"views/mobile/student/common/activity/guide_pay_20170628",
	//"static/mobile/student/js/activity/guide_pay_20170628",

	// 错题本
	"views/mobile/student/wrong_question", "static/mobile/student/css/wrong_question/css", "static/mobile/student/js/wrong_question"];
	var conf = {
		files: [{
			match: watchedFiles,
			fn: function fn(event, file) {
				console.log('file ' + event + ': ' + file);
			}
		}],
		proxy: '127.0.0.1:3000',
		port: 3002,
		open: 'external',
		host: 'hello.com',

		// 重启browser-sync时刷新所有浏览器中的页面
		reloadOnRestart: false,
		// 在浏览器右上角显示通知
		notify: true,

		logPrefix: "哇哈哈",
		logConnections: false
	};
	conf.files = conf.files.concat(watchedFiles);
	module.exports = conf;
})();