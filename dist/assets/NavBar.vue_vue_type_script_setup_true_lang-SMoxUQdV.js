import{N as p,d as k,c as l,F as c,a as o,O as m,r as x,o as s,n as u,t as g,e as w,P as _,l as M}from"./index-KbcMfjkF.js";/**
 * @license lucide-vue-next v0.325.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.325.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=(a,r)=>({size:n,strokeWidth:t=2,absoluteStrokeWidth:e,color:f,class:R,...y},{attrs:v,slots:h})=>p("svg",{...d,width:n||d.width,height:n||d.height,stroke:f||d.stroke,"stroke-width":e?Number(t)*24/Number(n):t,...v,class:["lucide",`lucide-${B(a)}`],...y},[...r.map(b=>p(...b)),...h.default?[h.default()]:[]]);/**
 * @license lucide-vue-next v0.325.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=i("BarChart3Icon",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-vue-next v0.325.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=i("BookOpenIcon",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-vue-next v0.325.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=i("LibraryIcon",[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]]);/**
 * @license lucide-vue-next v0.325.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=i("PenLineIcon",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}]]),I={class:"desktop-header hidden md:flex items-center justify-between py-5 mb-6"},z={class:"desktop-nav flex gap-2"},V=["href"],q={class:"mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white py-3 shadow-[0_-8px_32px_rgba(232,168,124,0.1)] border-t border-primary/10 z-50"},O={class:"mobile-nav-items flex justify-around"},P=["href"],$=k({__name:"NavBar",props:{currentRoute:{}},setup(a){const r=[{name:"学习",path:"/",icon:L},{name:"默写",path:"/quiz",icon:N},{name:"词库",path:"/wordbook",icon:j},{name:"统计",path:"/stats",icon:C}];return(n,t)=>(s(),l(c,null,[o("header",I,[t[0]||(t[0]=m('<div class="logo flex items-center gap-3"><div class="logo-icon w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_24px_rgba(232,168,124,0.3)]"> W </div><div class="logo-text"><h1 class="text-lg font-bold tracking-tight">WordMemo</h1><p class="text-xs text-text-muted tracking-widest uppercase">阳光学习</p></div></div>',1)),o("nav",z,[(s(),l(c,null,x(r,e=>o("a",{key:e.path,href:e.path,class:u(["nav-item px-5 py-3 rounded-full text-sm font-medium transition-all duration-normal relative",a.currentRoute===e.path?"bg-gradient-to-r from-primary to-accent text-white shadow-[0_8px_24px_rgba(232,168,124,0.3)]":"text-text-secondary hover:bg-accent-light hover:text-text-primary"])},g(e.name),11,V)),64))])]),t[1]||(t[1]=m('<header class="mobile-header md:hidden flex items-center justify-between py-4 mb-4"><div class="logo flex items-center gap-2"><div class="logo-icon w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-[0_8px_24px_rgba(232,168,124,0.3)]"> W </div><div class="logo-text"><h1 class="text-sm font-bold">WordMemo</h1><p class="text-[10px] text-text-muted tracking-wider uppercase">阳光学习</p></div></div></header>',1)),o("nav",q,[o("div",O,[(s(),l(c,null,x(r,e=>o("a",{key:e.path,href:e.path,class:u(["mobile-nav-item flex flex-col items-center gap-1 text-xs font-medium px-4 py-2 rounded-xl transition-all duration-normal",a.currentRoute===e.path?"text-primary bg-accent-light":"text-text-muted"])},[(s(),w(_(e.icon),{class:"w-5 h-5"})),M(" "+g(e.name),1)],10,P)),64))])])],64))}});export{$ as _};
