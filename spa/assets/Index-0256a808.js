import{L as _}from"./List-a6f22725.js";import{_ as d,o as p,c as r,F as b,a as f,d as s,t as g,r as u,n as o,P as v,Q as w}from"../main.js";import{v as j,u as k,t as x,r as y}from"./resources-dcdf6b28.js";const H={props:{list:Array},data(){return{}},methods:{},computed:{listAbundant(){return this.list.map((n,m)=>{var h;const c={...n};if(n.github){const[t,a]=(h=n.github)==null?void 0:h.replace("https://github.com/","").split("/");c.githubStars=`https://img.shields.io/github/stars/${t}/${a}?label=&style=social`}return c})}},created(){}},q={class:"fe-list"},L=["href"],S={class:"name"},z={class:"desc"},I=["src"];function C(n,m,c,h,t,a){return p(),r("div",q,[(p(!0),r(b,null,f(a.listAbundant,e=>(p(),r("a",{href:e.cnHref||e.href,target:"_blank",class:"item"},[s("div",S,g(e.name),1),s("div",z,g(e.desc),1),s("img",{src:e.githubStars,style:{"margin-top":"6px"}},null,8,I)],8,L))),256))])}const V=d(H,[["render",C],["__scopeId","data-v-61035cb3"]]);const A={components:{CompactList:V,List:_},data(){return{basic:[{name:"html",icon:"/spa/images/fe/h5.png",desc:"定义页面结构"},{name:"css",desc:"定义页面样式",icon:"/spa/images/fe/css3.svg"},{name:"js",desc:"控制页面逻辑",icon:"/spa/images/fe/js.svg"}],mvvm:[{name:"vue",desc:"易学易用",icon:"/spa/images/awesome/vue.svg",href:"/vue#/vue"},{name:"react",desc:"社区完善",icon:"/spa/images/awesome/react.svg",href:"/react#/react"}],enhance:[{name:"typescript",desc:"强类型版 js",icon:"/spa/images/logo/Typescript.svg",href:"https://www.typescriptlang.org/",github:"https://github.com/microsoft/TypeScript"},{name:"less",icon:"/spa/images/logo/less.png",iconStyle:"background: #1d365d;padding: 0 6px;",href:"https://lesscss.org/",github:"https://github.com/less/less.js",desc:"简单而轻量"},{name:"sass",icon:"/spa/images/logo/sass.svg",href:"https://sass-lang.com/",github:"https://github.com/sass/sass",desc:"强大且成熟"}],dataVisualization:[{name:"echarts",desc:"用 canvas 绘制",icon:"/spa/images/awesome/echarts-favicon.png",href:"https://echarts.apache.org/",cnHref:"https://echarts.apache.org/zh/index.html",github:"https://github.com/apache/echarts"},{name:"d3",desc:"用 svg 绘制",icon:"/spa/images/awesome/d3.svg",github:"https://github.com/d3/d3",href:"https://d3js.org/"}],buildTools:[{...j,desc:"下一代前端工具链"},{name:"webpack",desc:"一切皆可打包",github:"https://github.com/webpack/webpack",icon:"/spa/images/awesome/webpack.svg",href:"https://webpack.js.org/",cnHref:"https://webpack.docschina.org/"},{name:"gulp",desc:"流式构建",href:"https://gulpjs.com/",icon:"/spa/images/awesome/gulp.png",github:"https://github.com/gulpjs/gulp"},{name:"rollup",desc:"ES module 打包器",href:"https://rollupjs.org/",icon:"/spa/images/awesome/rollup.svg",github:"https://github.com/rollup/rollup",cnHref:"https://cn.rollupjs.org/"}],cross:[{...k,desc:"类 vue  跨平台"},{...x,desc:"类 react 跨平台"},{name:"flutter",desc:"性能出众",github:"https://github.com/flutter/flutter",icon:"/spa/images/logo/flutter.svg",href:"https://flutter.dev/"}],tools:[{name:"git",desc:"版本控制",icon:"/spa/images/logo/git.png",href:"https://git-scm.com/",github:"https://github.com/git/git"},{name:"prettier",desc:"代码美化",href:"https://prettier.io/",github:"https://github.com/prettier/prettier",icon:"/spa/images/logo/Prettier.png"},{name:"esLint",desc:"格式校验",icon:"/spa/images/logo/eslint.png",href:"https://eslint.org/",github:"https://github.com/eslint/eslint"}],other:[{name:"微信小程序",icon:"/spa/images/logo/miniprogram.png",href:"https://developers.weixin.qq.com/miniprogram/en/dev/framework/",cnHref:"https://developers.weixin.qq.com/miniprogram/dev/framework/"},{name:"微信小游戏",icon:"/spa/images/logo/minigame.png",href:"https://developers.weixin.qq.com/minigame/en/dev/guide/",cnHref:"https://developers.weixin.qq.com/minigame/dev/guide/"},{name:"chrome 扩展",icon:"/spa/images/logo/chrome.png",href:"https://developer.chrome.com/docs/extensions/reference/"},{name:"electron",desc:"跨平台桌面应用",icon:"/spa/images/logo/Electron.svg",href:"https://www.electronjs.org/",cnHref:"https://www.electronjs.org/zh/",github:"https://github.com/electron/electron"},{...y,desc:"跨平台移动APP"}],backend:[{name:"node.js",desc:"js运行时环境",icon:"/spa/images/awesome/nodejs-icon.svg",href:"https://nodejs.org/en",cnHref:"https://nodejs.org/zh-cn",github:"https://github.com/nodejs/node"},{name:"koa",desc:"下一代web框架",textIcon:"K",href:"https://koajs.com/",github:"https://github.com/koajs/koa"},{name:"express",desc:"简洁灵活的web框架",textIcon:"E",github:"https://github.com/expressjs/express",href:"https://expressjs.com/"}],database:[{name:"mongodb",desc:"面向文档的数据库",icon:"/spa/images/awesome/mongo.svg",href:"https://mongodb.github.io/node-mongodb-native/Next/",github:"https://github.com/mongodb/node-mongodb-native"},{name:"mysql",desc:"关系型数据库",icon:"/spa/images/awesome/MySQL.svg",github:"https://github.com/mysqljs/mysql",href:"https://dev.mysql.com/doc/"}],utils:[{name:"axios",desc:"网络请求",href:"https://axios-http.com/",github:"https://github.com/axios/axios",cnHref:"https://axios-http.com/zh/"},{name:"socket.io",desc:"websocket连接",github:"https://github.com/socketio/socket.io",href:"https://socket.io/",cnHref:"https://socket.io/zh-CN/"},{name:"moment",desc:"日期时间库",href:"https://momentjs.com/",github:"https://github.com/moment/moment"},{name:"lodash",desc:"实用函数库",href:"https://lodash.com/",github:"https://github.com/lodash/lodash"},{name:"swiper",desc:"轮播图",href:"https://swiperjs.com/",github:"https://github.com/nolimits4web/swiper"}],test:[{name:"chai",href:"https://www.chaijs.com/",github:"https://github.com/chaijs/chai"},{name:"karma",href:"https://karma-runner.github.io/",github:"https://github.com/karma-runner/karma"},{name:"mocha",href:"https://mochajs.org/",github:"https://github.com/mochajs/mocha"},{name:"jest",href:"https://jestjs.io/",cnHref:"https://jestjs.io/zh-Hans/",github:"https://github.com/jestjs/jest"},{name:"cypress",href:"https://www.cypress.io/",github:"https://github.com/cypress-io/cypress"},{name:"puppeteer",href:"https://pptr.dev/",github:"https://github.com/puppeteer/puppeteer"}],packageManager:[{name:"npm",github:"https://github.com/npm/cli",href:"https://docs.npmjs.com/cli/"},{name:"pnpm",github:"https://github.com/pnpm/pnpm",href:"https://pnpm.io/",cnHref:"https://pnpm.io/zh/"},{name:"yarn",href:"https://yarnpkg.com/",github:"https://github.com/yarnpkg/berry"}]}},methods:{},computed:{},created(){}},i=n=>(v("data-v-89c61882"),n=n(),w(),n),M={class:"section-list"},N=i(()=>s("h1",null,"基础",-1)),E=i(()=>s("h1",null,"MVVM 框架",-1)),P=i(()=>s("h1",null,"数据可视化",-1)),T=i(()=>s("h1",null,"构建工具",-1)),B=i(()=>s("h1",null,"增强",-1)),$=i(()=>s("h1",null,"工具",-1)),F=i(()=>s("h1",null,"客户端",-1)),Q=i(()=>s("h1",null,"跨端框架",-1)),D=i(()=>s("h1",null,"后端",-1)),K=i(()=>s("h1",null,"数据库",-1)),G={class:"section-list"},J=i(()=>s("h1",null,"包管理",-1)),O=i(()=>s("h1",null,"测试",-1)),R=i(()=>s("h1",null,"实用库",-1));function U(n,m,c,h,t,a){const e=u("List"),l=u("CompactList");return p(),r(b,null,[s("div",M,[s("section",null,[N,o(e,{list:t.basic},null,8,["list"])]),s("section",null,[E,o(e,{list:t.mvvm},null,8,["list"])]),s("section",null,[P,o(e,{list:t.dataVisualization},null,8,["list"])]),s("section",null,[T,o(e,{list:t.buildTools},null,8,["list"])]),s("section",null,[B,o(e,{list:t.enhance},null,8,["list"])]),s("section",null,[$,o(e,{list:t.tools},null,8,["list"])]),s("section",null,[F,o(e,{list:t.other},null,8,["list"])]),s("section",null,[Q,o(e,{list:t.cross},null,8,["list"])]),s("section",null,[D,o(e,{list:t.backend},null,8,["list"])]),s("section",null,[K,o(e,{list:t.database},null,8,["list"])])]),s("div",G,[s("section",null,[J,o(l,{list:t.packageManager},null,8,["list"])]),s("section",null,[O,o(l,{list:t.test},null,8,["list"])]),s("section",null,[R,o(l,{list:t.utils},null,8,["list"])])])],64)}const Z=d(A,[["render",U],["__scopeId","data-v-89c61882"]]);export{Z as default};
