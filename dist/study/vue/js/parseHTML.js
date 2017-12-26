'use strict';

(function () {
    'use strict';

    var tagName = '([a-zA-Z_][\\w\\-\\.]*)';
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var startTagOpen = new RegExp('^<' + tagName);
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp('^<\\/' + tagName + '[^>]*>');

    var index = 0;
    function advance(n) {
        index += n;
        html = html.substring(n);
    }

    function createASTElement(tag, attrs, parent) {
        return {
            type: 1,
            tag: tag,
            lowerCasedTag: tag.toLowerCase(),
            attrsList: attrs,
            parent: parent,
            children: []
        };
    }

    var root = void 0;
    var currentParent = void 0;
    var stack = []; // 标签元素栈

    function parseStartTag() {
        //-- 第一步 首先匹配开始标签的左边开头部分 --
        var start = html.match(startTagOpen);
        if (start) {
            var match = {
                tagName: start[1],
                attrs: [],
                start: index
            };
            advance(start[0].length);

            //-- 第二步 循环解析开始标签上的每一个属性键值对 --
            var end = void 0,
                attr = void 0;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3]
                });
            }

            //-- 第三步 匹配到开始标签的闭合部分，至此开始标签解析结束 --
            if (end) {
                match.unarySlash = end[1];
                advance(end[0].length);
            }

            // 解析完标签创建一个 AST 节点
            var element = createASTElement(match.tagName, match.attrs, currentParent);

            if (!root) {
                root = element;
            }

            if (currentParent) {
                currentParent.children.push(element);
            }

            // 自闭合就不用压入栈中了
            if (!match.unarySlash) {
                stack.push(element);
                currentParent = element;
            }
        }
    }

    function parseEndTag() {
        var end = html.match(endTag);
        if (end) {
            advance(end[0].length);

            var _tagName = end[1],
                lowerCasedTagName = _tagName.toLowerCase();
            var pos = void 0;

            // 从栈顶往栈底找，直到找到栈中离的最近的同类型标签
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break;
                }
            }

            // 如果找到了就取出对应的开始标签
            if (pos >= 0) {
                stack.length = pos;
                currentParent = stack[stack.length - 1];
            }
        }
    }

    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

    function parseText(text) {
        if (defaultTagRE.test(text)) {
            // tokens 用于分割普通文本和插值文本
            var tokens = [];
            var lastIndex = defaultTagRE.lastIndex = 0;
            var match = void 0,
                _index = void 0;
            while (match = defaultTagRE.exec(text)) {
                _index = match.index;

                // push 普通文本
                if (_index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, _index)));
                }
                // push 插值表达式
                tokens.push('_s(' + match[1].trim() + ')');

                // 游标前移
                lastIndex = _index + match[0].length;
            }

            // 将剩余的普通文本压入 tokens 中
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }

            currentParent.children.push({
                type: 2,
                expression: tokens.join('+'),
                text: text
            });
        } else {
            currentParent.children.push({
                type: 3,
                text: text
            });
        }
    }

    var html = void 0;

    function parseHTML(_html) {
        html = _html;

        while (html) {
            var textEnd = html.indexOf('<');
            if (textEnd === 0) {

                //-- 匹配开始标签 --
                var startTagMatch = html.match(startTagOpen);
                if (startTagMatch) {
                    parseStartTag();
                    continue;
                }

                //-- 匹配结束标签 --
                var endTagMatch = html.match(endTag);
                if (endTagMatch) {
                    parseEndTag();
                    continue;
                }
            }

            //-- 匹配文本 --
            var text = void 0,
                rest = void 0;
            if (textEnd >= 0) {
                rest = html.slice(textEnd);
                text = html.substring(0, textEnd);
                advance(textEnd);
            }
            if (textEnd < 0) {
                text = html;
                html = '';
            }
            text && parseText(text);
        }

        return root;
    }

    var tpl = '<div id="index"><p>hello, {{msg}}</p> by DOM\u54E5</div>';
    console.info('生成的AST↓↓↓');
    console.info(parseHTML(tpl));
})();