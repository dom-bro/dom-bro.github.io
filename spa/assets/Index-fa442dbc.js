import{_ as g,o as i,c as l,F as f,a as v,d as s,$ as a,L as y,t as r,r as p,g as t,M as w,N as b}from"../main.js";import{C as k,p as $}from"./resources-dcdf6b28.js";import{P as S}from"./PayPrompt-6b561a8e.js";const I={props:{list:Array},data(){return{}},methods:{},computed:{},created(){}},P={class:"resource-list"},x=["href"],G={class:"logo-name"},N={key:0,class:"icon-wrapper"},T=["src"],B=["src"],D={class:"name"};function M(o,_,d,h,m,u){return i(),l("div",P,[(i(!0),l(f,null,v(d.list,e=>(i(),l("a",{href:e.href,target:"_blank",class:"item"},[s("div",G,[e.icon?(i(),l("div",N,[e.iconBgStyle?(i(),l("div",{key:0,class:"icon-bg",style:a([e.iconBgStyle])},null,4)):(i(),l("img",{key:1,class:"icon-bg",src:e.icon,style:a([e.iconStyle])},null,12,T)),s("img",{class:"icon",src:e.icon,style:a([e.iconStyle])},null,12,B)])):y("",!0),s("div",D,r(e.title),1)]),s("div",{class:"desc",style:a([e.descStyle])},r(e.desc),5)],8,x))),256))])}const C=g(I,[["render",M],["__scopeId","data-v-eb094c52"]]),L={se:[{title:"Google",desc:"搜索引擎市场份额 80%，妥妥的行业老大",icon:"/spa/images/logo/google.svg",href:"https://www.google.com/"},{title:"DuckDuckGo",desc:"主打用户隐私。不会跟踪、收集或存储任何数据",icon:"/spa/images/logo/DuckDuckGo.svg",href:"https://duckduckgo.com/"}],develop:[{title:"GitHub",desc:"全球最大同性交友网站",icon:"/spa/images/logo/github.svg",href:"https://github.com/"}],ai:[k,$,{title:"Midjourney",desc:"文生图，让你的想象不再只是想象",icon:"/spa/images/logo/Midjourney.png",href:"https://midjourney.com/"}],video:[{desc:"油管，全球最大的视频搜索和分享平台",descStyle:"margin-top: 6px;",icon:"/spa/images/logo/youtube.svg",href:"https://www.youtube.com/"},{desc:"抖音海外版，记录别人的美好生活",descStyle:"margin-top: 6px;",icon:"/spa/images/logo/TikTok.png",href:"https://www.tiktok.com/"},{title:"Netflix",desc:"网飞，类似国内爱优腾",icon:"/spa/images/logo/Netflix.svg",href:"https://www.netflix.com/"}],socialMedia:[{title:"Facebook",desc:"脸书",icon:"/spa/images/logo/facebook.png",href:"https://www.facebook.com/"},{title:"Twitter",desc:"推特，类似国内微博",icon:"/spa/images/logo/twitter.svg",href:"https://twitter.com/"},{title:"Instagram",desc:"照片墙，图片及视频分享平台",icon:"/spa/images/logo/Instagram.svg",href:"https://www.instagram.com/"}],other:[{title:"Gmail",desc:"",icon:"/spa/images/logo/Gmail.svg",href:"https://mail.google.com/"},{title:"Telegram",desc:"电报",icon:"/spa/images/logo/Telegram.svg",href:"https://telegram.org/"},{desc:"社群聊天室",descStyle:"margin-top: 6px;",icon:"/spa/images/logo/discord-logo-blue.svg",href:"https://discord.com/"}],porn:[{desc:"",icon:"/spa/images/logo/Pornhub.svg",href:"https://pornhub.com/"},{desc:"",icon:"/spa/images/logo/porndude.svg",href:"https://theporndude.com/"}]};const j={components:{PayPrompt:S,List:C},data(){return{...L}},methods:{},computed:{},created(){}},n=o=>(w("data-v-b12e721f"),o=o(),b(),o),F={class:"outside"},V={class:"column"},A=n(()=>s("h1",null,"搜索引擎",-1)),z=n(()=>s("h1",null,"开发",-1)),E=n(()=>s("h1",null,"AI",-1)),H={class:"column"},q=n(()=>s("h1",null,"视频",-1)),J=n(()=>s("h1",null,"社交媒体",-1)),K={class:"column"},O=n(()=>s("h1",null,"其他",-1)),Q={class:"indescribable"},R=n(()=>s("h1",null,"不可描述",-1));function U(o,_,d,h,m,u){const e=p("PayPrompt"),c=p("list");return i(),l("div",F,[t(e),s("div",V,[A,t(c,{list:o.se},null,8,["list"]),z,t(c,{list:o.develop},null,8,["list"]),E,t(c,{list:o.ai},null,8,["list"])]),s("div",H,[q,t(c,{list:o.video},null,8,["list"]),J,t(c,{list:o.socialMedia},null,8,["list"])]),s("div",K,[O,t(c,{list:o.other},null,8,["list"]),s("div",Q,[R,t(c,{list:o.porn,class:"blur"},null,8,["list"])])])])}const Z=g(j,[["render",U],["__scopeId","data-v-b12e721f"]]);export{Z as default};
