import{_ as c,r as l,o as m,c as _,n as i,w as P,u as o,d as e,O as f,P as u,Q as h}from"../main.js";const y={props:{alwaysShow:Boolean},data(){return{show:localStorage.getItem("forbidPayPrompt")!==moment().format("YYYY-MM-DD")}},methods:{forbidPayPrompt(){this.show=!1,localStorage.setItem("forbidPayPrompt",moment().format("YYYY-MM-DD"))},checkGoogle(){localStorage.getItem("forbidPayPrompt"),moment().format("YYYY-MM-DD")}},computed:{},created(){}},Y=t=>(u("data-v-19d34dd8"),t=t(),h(),t),w={key:0,class:"pay-prompt"},v=Y(()=>e("div",{class:"prompt"},[o("如果你需要 "),e("span",null,"科学上网"),o("，"),e("span",null,"手机翻墙"),o("，"),e("span",null,"注册美区AppleID"),o("，"),e("span",null,"注册ChatGPT"),o("，可以联系我吖！")],-1));function I(t,a,s,S,d,r){const n=l("router-link");return s.alwaysShow||d.show?(m(),_("div",w,[v,i(n,{to:"/paid-service"},{default:P(()=>[o("了解一下")]),_:1}),e("a",{href:"javascript:",onClick:a[0]||(a[0]=(...p)=>r.forbidPayPrompt&&r.forbidPayPrompt(...p)),class:"not-interest"},"不感兴趣")])):f("",!0)}const k=c(y,[["render",I],["__scopeId","data-v-19d34dd8"]]);export{k as P};