'use strict';

(function () {
    'use strict';

    /*
     * 描述交互和展示逻辑注意点
     * {} - 包含部件
     * [] - 叶子约束
     */

    var data = {
        config: {
            direction: 'row'
        },
        订正任务: {
            去领奖: {
                config: {
                    direction: 'row',
                    done: true
                },
                展示: ['黑名单隐藏'],
                交互: ['<span>点击前往成长世界']
            },
            每日回顾: {
                config: {
                    direction: 'row'
                },
                展示: ['展示订正状态'],
                交互: ['点击前往作业页面']
            },
            订正列表: {
                config: {
                    direction: 'row'
                },
                展示: ['展示订正状态'],
                交互: ['点击前往作业页面']
            }
        },
        错题中心: {
            筛选框: {
                config: {
                    direction: 'row'
                },
                展示: ['选中状态'],
                交互: ['点击筛选项选中并收起筛选框, 重新加载错题列表数据', '<span>点击筛选框外区域收起筛选框']
            },
            错题列表: {
                config: {
                    direction: 'row'
                },
                展示: ['展示订正状态', '未订正状态展示我的回答', '订正状态不展示我的回答'],
                交互: ['点击列表项前往作业页面(venus)', '上拉加载更多(dropload)', '点击去做题，做完题回来只刷新该道题状态']
            }

        }
    };

    var ua = window.navigator.userAgent.toLowerCase();

    require(['jquery', 'vue'], function ($, Vue) {
        // newVue({
        //     el: '#index',
        //     data: {
        //         needs: data,
        //     }
        // });

        var currentDOM = $('.container'),
            level = 0;

        // 深度优先遍历算法
        function iterate(obj) {
            currentDOM.addClass('column');

            Object.keys(obj).forEach(function (key) {
                if (obj.hasOwnProperty(key)) {
                    switch (key) {
                        case 'config':
                            var config = obj[key];
                            if (config.direction) {
                                currentDOM.removeClass('row column').addClass(config.direction);
                            }
                            if (config.done) {
                                currentDOM.parent().addClass('done');
                            }
                            break;
                        default:
                            var dom = '<div class="item level-' + level + '">\n                                        <p class="title">' + key + '</p>\n                                        <div class="wrapper"></div>\n                                   </div>',
                                temp = $(dom);
                            currentDOM.append(temp);

                            // 叶子
                            if (Array.isArray(obj[key])) {
                                var html = '<ol class="list">';
                                obj[key].forEach(function (item, index) {
                                    html += '<li>' + (index + 1) + '\u3001' + item + '</li>';
                                });
                                html += '</ol>';

                                temp.addClass('leaf').children('.wrapper').append(html);
                            } else {
                                currentDOM = temp.children('.wrapper');
                                ++level;
                                iterate(obj[key]);
                            }
                    }
                }
            });
            currentDOM = currentDOM.parent().parent();
            --level;
        }

        iterate(data);

        $(document).on('click', '.showDone', function () {
            $('.done').show();
        });
        $(document).on('click', '.hideDone', function () {
            $('.done').hide();
        });
    });
})();