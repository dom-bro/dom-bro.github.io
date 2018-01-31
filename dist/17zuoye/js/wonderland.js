'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    var mock = require('../_mock');
    var _ = require('lodash');

    var all = [];
    function push(cb) {
        all.push.apply(all, _toConsumableArray(cb()));
    }
    var _URL_POOL_ = {};
    function broUrl(url) {
        if (_URL_POOL_[url] === undefined) {
            _URL_POOL_[url] = 0;
        }
        return url + _URL_POOL_[url]++;
    }

    // 扩展示例
    push(function () {
        var URL = {
            index: '/sample/index'
        };
        return [
        // index
        {
            0: 'normal',
            uri: broUrl(URL.index),
            opts: {
                body: {
                    "success": true
                }
            }
        }];
    });

    // 小鹰学堂
    push(function () {
        return [{
            uri: '/studentMobile/babyeagle/givegood.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "currentGoodTotal": 2
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/goodlist.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "recordList": [{
                        "studentId": 30010,
                        "studentName": "Jennifer Lawrence",
                        "profileUrl": "avatar-30010-52d6518de4b00484aa28772e.jpg",
                        "dataTimeFormat": "20170705"
                    }]
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/course/index.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "subject": "ENCYCLOPEDIA",
                    "coursesInfo": [{
                        "currentTime": 1499333235249,
                        "courseName": "百科测试1",
                        "courseStatus": "WAIT",
                        "startNum": 0,
                        "giftStatus": "WaitProvide",
                        "endTime": 1499504400000,
                        "courseId": "595dfad78edbc8b6ae842f65"
                    }, {
                        "currentTime": 1499333235249,
                        "courseName": "百科测试2",
                        "courseStatus": "PLAY",
                        "startNum": 1,
                        switch17LiveFlag: true,
                        "giftStatus": "NotReceived",
                        // "endTime":1499333235249 + 24*60*60*1000 + 2000,
                        "endTime": 1499333235249 + 2000,
                        "courseId": "595dea81ac7459ab216305cb"
                    }, {
                        "currentTime": 1499333235249,
                        "courseName": "百科测试3",
                        "courseStatus": "OVER",
                        "startNum": 2,
                        "giftStatus": "HasReceived",
                        "endTime": 1499592600000,
                        "courseId": "595dea81ac7459ab216305cb"
                    }, {
                        "currentTime": 1499333235249,
                        "courseName": "百科测试4",
                        "courseStatus": "FINISH",
                        "startNum": 3,
                        "giftStatus": "CanReceive",
                        "endTime": 1499592600000,
                        "courseId": "595dea81ac7459ab216305cb"
                    }],
                    "timesCard": 0,
                    "currentGrade": "LV4",
                    "nextGradeNeedCount": 6,
                    "myLearnedCourseTotal": 5,
                    "myStarTotal": 3,
                    "myRank": 1,
                    qqGroupNum: 123
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/rank.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "rankList": [{
                        "studentId": 30011,
                        "studentName": "Keira Knightley",
                        "profileUrl": "avatar-30011-52ac876ae4b07f63bcbca284.jpg",
                        "learnGrade": "LV2",
                        "starTotal": 3,
                        "goodTotal": 1,
                        "isGaveGood": true,
                        "rank": 1
                    }, {
                        "studentId": 30014,
                        "studentName": "Jennifer Lawrence",
                        "profileUrl": "avatar-30010-52d6518de4b00484aa28772e.jpg",
                        "learnGrade": "LV1",
                        "starTotal": 1,
                        "goodTotal": 1,
                        "isGaveGood": false,
                        "rank": 2
                    }, {
                        "studentId": 30010,
                        "studentName": "@cname",
                        "profileUrl": "avatar-30010-52d6518de4b00484aa28772e.jpg",
                        "learnGrade": "LV4",
                        "starTotal": 78,
                        "goodTotal": 999,
                        "isGaveGood": false,
                        "rank": 3
                    }, {
                        "studentId": 30010,
                        "studentName": "@cname",
                        "profileUrl": "avatar-30010-52d6518de4b00484aa28772e.jpg",
                        "learnGrade": "LV3",
                        "starTotal": 78,
                        "goodTotal": 50000,
                        "isGaveGood": false,
                        "rank": 4
                    }],
                    "studentId": 30010,
                    "schoolName": "北京市海淀区北医附小",
                    "goodCountForThisWeek": 0
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/index.vpage-mock',
            opts: {
                // body: {
                // 	"success": true,
                // 	"learnGradeList": [
                // 		{
                // 			"name": "见习",
                // 			"type": "LV1",
                // 			"index": 1
                // 		},
                // 		{
                // 			"name": "学徒",
                // 			"type": "LV2",
                // 			"index": 2
                // 		},
                // 		{
                // 			"name": "资深",
                // 			"type": "LV3",
                // 			"index": 3
                // 		},
                // 		{
                // 			"name": "精英",
                // 			"type": "LV4",
                // 			"index": 4
                // 		}
                // 	],
                // 	"subjectsInfo": [
                // 		{
                // 			"isOpen": true,
                // 			"courseNum": 0,
                // 			"stuCourseNum": 0,
                // 			"subjectType": "ENCYCLOPEDIA",
                // 			"subjectName": "百科"
                // 		},
                // 		{
                // 			"isOpen": false,
                // 			"courseNum": 0,
                // 			"stuCourseNum": 0,
                // 			"subjectType": "ENGLISH",
                // 			"subjectName": "英语"
                // 		},
                // 		{
                // 			"isOpen": false,
                // 			"courseNum": 0,
                // 			"stuCourseNum": 0,
                // 			"subjectType": "MATH",
                // 			"subjectName": "数学"
                // 		},
                // 		{
                // 			"isOpen": false,
                // 			"courseNum": 0,
                // 			"stuCourseNum": 0,
                // 			"subjectType": "CHINESE",
                // 			"subjectName": "语文"
                // 		}
                // 	],
                // 	"timesCard": 0,
                // 	"currentGrade": "LV1",
                // 	"nextGradeNeedCount": 6,
                // 	"myLearnedCourseTotal": 5,
                // 	"myStarTotal": 3,
                // 	"myRank": 1,
                // 	"isUpgraded": true,
                // 	"studentList": [
                // 		{
                // 			"studentId": 30011,
                // 			"studentName": "Keira Knightley",
                // 			"profileUrl": "avatar-30011-52ac876ae4b07f63bcbca284.jpg"
                // 		},
                // 		{
                // 			"studentId": 30010,
                // 			"studentName": "Jennifer Lawrence",
                // 			"profileUrl": "avatar-30010-52d6518de4b00484aa28772e.jpg"
                // 		}
                // 	],
                // 	"studentCount": 2
                // },
                body: {
                    "success": true,
                    "learnGradeList": [{
                        "name": "见习",
                        "type": "LV1",
                        "index": 1
                    }, {
                        "name": "学徒",
                        "type": "LV2",
                        "index": 2
                    }, {
                        "name": "资深",
                        "type": "LV3",
                        "index": 3
                    }, {
                        "name": "精英",
                        "type": "LV4",
                        "index": 4
                    }],
                    "subjectsInfo": [{
                        "isOpen": true,
                        "courseNum": 2,
                        "stuCourseNum": 2,
                        "subjectType": "ENCYCLOPEDIA",
                        "subjectName": "百科"
                    }, {
                        "isOpen": false,
                        "courseNum": 0,
                        "stuCourseNum": 0,
                        "subjectType": "ENGLISH",
                        "subjectName": "英语-三下"
                    }, {
                        "isOpen": false,
                        "courseNum": 0,
                        "stuCourseNum": 0,
                        "subjectType": "MATH",
                        "subjectName": "数学-三下"
                    }, {
                        "isOpen": false,
                        "courseNum": 0,
                        "stuCourseNum": 0,
                        "subjectType": "CHINESE",
                        "subjectName": "语文-三下"
                    }],
                    "timesCard": 6,
                    "myLearnedCourseTotal": 2,
                    "myStarTotal": 0,
                    "myRank": 0,
                    "currentGrade": "LV1",
                    "nextGradeNeedCount": 1,
                    "isUpgraded": false,
                    "recommendCourseList": [{
                        "courseId": "59660e5c8edbc84d6c762c93",
                        "courseName": "语文同步练",
                        "subjectName": "语文",
                        "courseStatus": "PLAY",
                        "startTime": 1500623021844,
                        "todayEndTime": 1500623021848
                    }, {
                        "courseId": "5971a1b4ac745951923c214e",
                        "courseName": "7-21-第四节",
                        "subjectName": "英语",
                        "courseStatus": "PLAY",
                        "startTime": 1500623021818,
                        "todayEndTime": 1500623021848
                    }, {
                        "courseId": "59648d02ac7459aba55caca0",
                        "courseName": "百科二年级",
                        "subjectName": "百科",
                        "courseStatus": "WAIT",
                        "startTime": 1500854400000,
                        "todayEndTime": 1500854400000
                    }, {
                        "courseId": "5964938b8edbc88ff731a722",
                        "courseName": "晚9点开始课测试",
                        "subjectName": "百科",
                        "courseStatus": "OVER",
                        "startTime": 1500623021848,
                        "todayEndTime": 1500623021848
                    }]
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/course/classhoursinfo.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "classHoursTime": [{
                        "date": 1499443200000,
                        dateName: '7月17日',
                        week: 1,
                        "timeList": ["07:00-07:30", "08:00-08:30", "17:00-17:30", "17:00-17:30", "17:00-17:30", "17:00-17:30"]
                    }, {
                        "date": 1499529600000,
                        dateName: '7月17日',
                        week: 2,
                        "timeList": ["07:30-08:00", "08:30-09:00"]
                    }]
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/course/entry.vpage-mock',
            opts: {
                body: {
                    "success": '@bool',
                    info: '哇哈哈',
                    "courseId": "59562e7ef1620122f0dad422",
                    // "playUrl": "",
                    "playUrl": "http://open.talk-fun.com/room.php?ak=e1c8bb463389c4b210d1cf9928d5d343",
                    "playedTime": -1,
                    "needTicketCount": 0,
                    "status": "OVER",
                    "canPlay": '@bool',
                    "accessKey": "e0cd63ab0fdf2bb781a1eb1a0847b87b",
                    "talkFunCourseId": "45210"
                }
            }
        }, {
            uri: '/studentMobile/babyeagle/course/buy.vpage-mock',
            opts: {
                body: {
                    "success": false,
                    info: 'info',
                    errorCode: 1,
                    "playUrl": "http://open.talk-fun.com/room.php?ak=e1c8bb463389c4b210d1cf9928d5d343",
                    // "playUrl": null,
                    "status": "FINISH"
                }
            }
        }, {
            uri: '/wonderland/order/appproducts.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "count": "",
                    "products": [{
                        "period": 2,
                        "originalPrice": 20,
                        "price": 8,
                        "name": "超值体验卡",
                        "attributes": "sample_sack",
                        "id": "5940e398e92b1b7613acf4fb",
                        "type": "ValueAddedLiveTimesCard",
                        "rewards": [],
                        "desc": "超值体验卡"
                    }, {
                        "period": 2,
                        "originalPrice": 20,
                        "price": 20,
                        "name": "听课卡2张",
                        "attributes": "  ",
                        "id": "5940e3b27774871c2f3cc22c",
                        "type": "ValueAddedLiveTimesCard",
                        "rewards": [],
                        "desc": "听课卡2张"
                    }, {
                        "period": 10,
                        "originalPrice": 100,
                        "price": 90,
                        "name": "听课卡10张",
                        "attributes": "  ",
                        "id": "5940e3cee92b1b7613acf50b",
                        "type": "ValueAddedLiveTimesCard",
                        "rewards": [],
                        "desc": "听课卡10张"
                    }, {
                        "period": 20,
                        "originalPrice": 200,
                        "price": 120,
                        "name": "听课卡20张",
                        "attributes": "  ",
                        "id": "5940e3e37774871c2f3cc23c",
                        "type": "ValueAddedLiveTimesCard",
                        "rewards": [],
                        "desc": "听课卡20张"
                    }],
                    "name": "听课卡",
                    "desc": "",
                    "grade": 5,
                    "term": 2
                }
            }
        }, {
            uri: '/wonderland/activity/timescardpresell.vpage-mock',
            opts: {
                body: {
                    "success": true,
                    "times": 2,
                    "sampleSackPurchased": true
                }
            }
        }];
    });

    // 错题本
    push(function () {
        var URL = {
            index: '/wonderland/wrongquestion/index.vpage',
            tasks: '/studentMobile/fairyland/task/homeworkcorrecttasks.vpage',
            questions: '/wonderland/wrongquestion/pagelist.vpage',
            q_content: '/exam/flash/load/question/byids.vpage',
            correct: '/wonderland/wrongquestion/processcorrectedresult.vpage' // POST
        };
        return [
        // index
        {
            0: 'normal',
            uri: broUrl(URL.index),
            opts: {
                body: {
                    "success": true,
                    "result": [{
                        "subject": "MATH",
                        "uncorrectedCount": 50
                    }, {
                        "subject": "ENGLISH",
                        "uncorrectedCount": 160
                    }]
                }
            }
        }, {
            1: 'success: false',
            uri: broUrl(URL.index),
            opts: {
                body: {
                    "success": false
                }
            }
        }, {
            2: 'result: []',
            uri: broUrl(URL.index),
            opts: {
                body: {
                    "success": true,
                    "result": []
                }
            }
        },

        // tasks
        {
            0: 'normal',
            uri: broUrl(URL.tasks),
            opts: {
                body: {
                    "success": true,
                    "tasks": [{
                        "taskId": "333909049-596727358edbc87afe60dd15",
                        "heading": "消灭作业错题--07月13日数学作业",
                        "questionCount": 2,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "ongoing",
                        "date": "07-13",
                        "homeworkId": "201707_59672735e92b1b1711291214_333909049",
                        "subject": "MATH"
                    }, {
                        "taskId": "333909049-595f6f2dac74595e95b8d6b5",
                        "heading": "消灭作业错题--07月07日英语作业",
                        "questionCount": 1,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "reward",
                        "date": "07-07",
                        "homeworkId": "201707_595f6f2e8edbc838ce7d53ab_333909049",
                        "subject": "ENGLISH"
                    }],
                    "version": "V2_5_0",
                    "black": false
                }
            }
        }, {
            1: 'success: false',
            uri: broUrl(URL.tasks),
            opts: {
                body: {
                    "success": false
                }
            }
        }, {
            2: 'tasks: []',
            uri: broUrl(URL.tasks),
            opts: {
                body: {
                    "success": true,
                    "tasks": [{
                        "taskId": "333909049-596727358edbc87afe60dd15",
                        "heading": "消灭作业错题--07月13日数学作业",
                        "questionCount": 2,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "ongoing",
                        "date": "07-13",
                        "homeworkId": "201707_59672735e92b1b1711291214_333909049",
                        "subject": "MATH"
                    }, {
                        "taskId": "333909049-595f6f2dac74595e95b8d6b5",
                        "heading": "消灭作业错题--07月07日英语作业",
                        "questionCount": 1,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "reward",
                        "date": "07-07",
                        "homeworkId": "201707_595f6f2e8edbc838ce7d53ab_333909049",
                        "subject": "ENGLISH"
                    }],
                    "version": "V2_5_0",
                    "black": false
                }
            }
        }, {
            3: 'tasks.length > 30',
            uri: broUrl(URL.tasks),
            opts: {
                body: {
                    "success": true,
                    "tasks|40": [{
                        "taskId": "333909049-596727358edbc87afe60dd15",
                        "heading": "消灭作业错题--07月13日数学作业",
                        "questionCount": 2,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "ongoing",
                        "date": "07-13",
                        "homeworkId": "201707_59672735e92b1b1711291214_333909049",
                        "subject": "MATH"
                    }, {
                        "taskId": "333909049-595f6f2dac74595e95b8d6b5",
                        "heading": "消灭作业错题--07月07日英语作业",
                        "questionCount": 1,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "reward",
                        "date": "07-07",
                        "homeworkId": "201707_595f6f2e8edbc838ce7d53ab_333909049",
                        "subject": "ENGLISH"
                    }],
                    "version": "V2_5_0",
                    "black": false
                }
            }
        }, {
            4: 'black: true',
            uri: broUrl(URL.tasks),
            opts: {
                body: {
                    "success": true,
                    "tasks": [{
                        "taskId": "333909049-596727358edbc87afe60dd15",
                        "heading": "消灭作业错题--07月13日数学作业",
                        "questionCount": 2,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "ongoing",
                        "date": "07-13",
                        "homeworkId": "201707_59672735e92b1b1711291214_333909049",
                        "subject": "MATH"
                    }, {
                        "taskId": "333909049-595f6f2dac74595e95b8d6b5",
                        "heading": "消灭作业错题--07月07日英语作业",
                        "questionCount": 1,
                        "basicReward": 1,
                        "fullMarkReward": 2,
                        "nowaday": false,
                        "status": "reward",
                        "date": "07-07",
                        "homeworkId": "201707_595f6f2e8edbc838ce7d53ab_333909049",
                        "subject": "ENGLISH"
                    }],
                    "version": "V2_5_0",
                    "black": true
                }
            }
        }, {
            5: 'black: true & 2',
            uri: broUrl(URL.tasks),
            opts: {
                body: {
                    "success": true,
                    "tasks": [],
                    "version": "V2_5_0",
                    "black": true
                }
            }
        },

        // questions
        {
            0: 'normal',
            uri: broUrl(URL.questions),
            opts: {
                body: {
                    "success": true,
                    "questions|30": [{
                        "qid": "Q_10300483225327-2",
                        "date": "2017-08-15 18:46:01",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"go\",\"play\"]]",
                        "subMaster": "[[false,false]]"
                    }, {
                        "qid": "Q_10300250857444",
                        "date": "2017-08-15 18:45:37",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"2\"]]",
                        "subMaster": "[[false]]"
                    }, {
                        "qid": "Q_10300386292465",
                        "date": "2017-08-15 18:44:55",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"f\",\"f\"]]",
                        "subMaster": "[[false,false]]"
                    }, {
                        "qid": "Q_10300384394428-1",
                        "date": "2017-08-15 18:44:38",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"What\",\"are\",\"uy\",\"is\",\"going\",\"to\"]]",
                        "subMaster": "[[true,false,true,true,true,true]]"
                    }, {
                        "qid": "Q_10300382430823",
                        "date": "2017-08-15 18:41:50",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"s\"]]",
                        "subMaster": "[[false]]"
                    }, {
                        "qid": "Q_10300533309527-2",
                        "date": "2017-08-15 18:41:23",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"0\"]]",
                        "subMaster": "[[false]]"
                    }, {
                        "qid": "Q_10300388440144",
                        "date": "2017-08-15 18:41:16",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"1\"]]",
                        "subMaster": "[[false]]"
                    }, {
                        "qid": "Q_10300504659288-2",
                        "date": "2017-08-15 18:41:03",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"3\"]]",
                        "subMaster": "[[false]]"
                    }],
                    "page": 1
                }
            }
        }, {
            1: 'success: false',
            uri: broUrl(URL.questions),
            opts: {
                body: {
                    "success": false
                }
            }
        }, {
            2: 'questions: []',
            uri: broUrl(URL.questions),
            opts: {
                body: {
                    "success": true,
                    "questions": [],
                    "page": 1
                }
            }
        }, {
            3: 'questions.length < 10',
            uri: broUrl(URL.questions),
            opts: {
                body: {
                    "success": true,
                    "questions": [{
                        "qid": "Q_10300483225327-2",
                        "date": "2017-08-15 18:46:01",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"go\",\"play\"]]",
                        "subMaster": "[[false,false]]"
                    }, {
                        "qid": "Q_10300250857444",
                        "date": "2017-08-15 18:45:37",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"2\"]]",
                        "subMaster": "[[false]]"
                    }, {
                        "qid": "Q_10300386292465",
                        "date": "2017-08-15 18:44:55",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"f\",\"f\"]]",
                        "subMaster": "[[false,false]]"
                    }, {
                        "qid": "Q_10300384394428-1",
                        "date": "2017-08-15 18:44:38",
                        "source": "afenti",
                        "sourceName": "阿分提错题",
                        "corrected": false,
                        "userAnswers": "[[\"What\",\"are\",\"uy\",\"is\",\"going\",\"to\"]]",
                        "subMaster": "[[true,false,true,true,true,true]]"
                    }],
                    "page": 1
                }
            }
        },

        // correct
        {
            0: 'normal',
            uri: broUrl(URL.correct),
            opts: {
                body: {
                    "success": true,
                    "correctedResult": true
                }
            }
        }];
    });

    _.extend(module.exports, {
        routes: mock.help_build_routes(all, 'g')
    });
})();