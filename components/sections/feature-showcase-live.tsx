"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive "live preview" bundle showcase — a faithful port of the PushBundle
 * demo snippet (pb_snippet_7): five interactive bundle builders (Volume,
 * Cross-Sell, Mix & Match single/multi, Build Your Own Box) with a cart drawer,
 * add-to-cart toast, a "Live — try it below" cue in each preview title bar, an
 * entrance attention-pulse on the tab bar, and a ghost-cursor auto-demo on the
 * Volume tab that auto-clicks two tiers to show the preview is interactive, then
 * invites the visitor to take over.
 *
 * The widget is self-contained (its own scoped CSS under `.pb-home`, its own
 * markup, and its own vanilla JS run once on mount) and is pinned to a light
 * palette so it always reads as a real storefront. It is English-only by design
 * (the interactive copy lives inside the widget); the rest of the home page
 * stays localized.
 */

const CSS = String.raw`
  .pb-home{--ink:#23201c;--muted:#6f685c;--bg:#faf7f2;--card:#ffffff;--line:#ece6dc;--green:#2f5d50;--green-d:#274d43;--rose:#d98b7a;--gold:#b98a44;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;}
  .pb-home *{box-sizing:border-box;}
  .pb-home .pb-wrap{max-width:1400px;margin:0 auto;padding:0 24px;}
  .pb-home h1,.pb-home h2,.pb-home h3{font-family:'Fraunces',Georgia,serif;font-weight:500;line-height:1.12;letter-spacing:-.01em;margin:0;}
  .pb-home .pb-eyebrow{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--green);}
  .pb-home a{color:inherit;}
  .pb-home .pb-btn{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-weight:600;font-size:15px;text-decoration:none;border-radius:999px;padding:14px 26px;transition:transform .15s ease,background .2s ease,box-shadow .2s ease;cursor:pointer;}
  .pb-home .pb-sec-head{text-align:center;max-width:620px;margin:0 auto 8px;}
  .pb-home .pb-sec-head h2{font-size:clamp(30px,3.6vw,42px);margin:14px 0 14px;}
  .pb-home .pb-sec-head p{color:var(--muted);font-size:17px;margin:0;}
  /* Interactive Demo (tabbed) */
  .pb-home .pb-idemo{padding:78px 0 74px;background:#f4efe7;border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
  .pb-home .pb-idemo .pb-sec-head{margin-bottom:30px;}
  .pb-home .pb-tabs-input{position:absolute;opacity:0;pointer-events:none;}
  .pb-home .pb-tabbar{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:0 auto 40px;}
  .pb-home .pb-pv-bar .pb-livecue{margin-left:auto;display:inline-flex;align-items:center;gap:7px;font-family:'Inter',sans-serif;font-size:12.5px;font-weight:500;font-style:normal;letter-spacing:normal;text-transform:none;color:#8b93a1;white-space:nowrap;}
  .pb-home .pb-livecue .live-dot{position:relative;width:6px;height:6px;flex:none;}
  .pb-home .pb-livecue .live-dot::before{content:"";position:absolute;inset:0;border-radius:50%;background:#f10404;opacity:.55;animation:pbPing 1.7s cubic-bezier(0,0,.2,1) infinite;}
  .pb-home .pb-livecue .live-dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:#f10404;}
  @keyframes pbPing{0%{transform:scale(1);opacity:.55;}75%,100%{transform:scale(2.5);opacity:0;}}
  @media(prefers-reduced-motion:reduce){.pb-home .pb-livecue .live-dot::before{animation:none;}}
  .pb-home .pb-tab{font-family:'Inter',sans-serif;font-size:14.5px;font-weight:600;color:var(--muted);background:#fff;border:1px solid var(--line);border-radius:999px;padding:11px 20px;cursor:pointer;transition:all .18s ease;user-select:none;display:inline-flex;align-items:center;gap:8px;}
  .pb-home .pb-tab:hover{color:var(--ink);border-color:#d8cfc0;}
  @keyframes pbPillPop{0%,100%{transform:scale(1);}45%{transform:scale(1.08);}}
  @keyframes pbGlowRing{0%{box-shadow:0 8px 18px rgba(59,130,246,.26),0 0 0 0 rgba(59,130,246,.38);}70%{box-shadow:0 8px 18px rgba(59,130,246,.26),0 0 0 13px rgba(59,130,246,0);}100%{box-shadow:0 8px 18px rgba(59,130,246,.26),0 0 0 0 rgba(59,130,246,0);}}
  .pb-home .pb-tabbar.cue .pb-tab{animation:pbPillPop .5s ease both;}
  .pb-home .pb-tabbar.cue .pb-tab:nth-child(2){animation-delay:.07s;}
  .pb-home .pb-tabbar.cue .pb-tab:nth-child(3){animation-delay:.14s;}
  .pb-home .pb-tabbar.cue .pb-tab:nth-child(4){animation-delay:.21s;}
  .pb-home .pb-tabbar.cue .pb-tab:nth-child(5){animation-delay:.28s;}
  .pb-home .pb-tab.cueglow{animation:pbPillPop .5s ease both, pbGlowRing 1.15s ease .32s 5 !important;}
  @media(prefers-reduced-motion:reduce){.pb-home .pb-tabbar.cue .pb-tab,.pb-home .pb-tab.cueglow{animation:none !important;}}
  .pb-home .pb-tab .ti{font-size:15px;line-height:1;}
  .pb-home .pb-panel{display:none;}
  .pb-home .pb-panel-grid{display:grid;grid-template-columns:1.12fr .88fr;gap:46px;align-items:center;}
  #pbtab1:checked~.pb-tabbar label[for=pbtab1],
  #pbtab2:checked~.pb-tabbar label[for=pbtab2],
  #pbtab3:checked~.pb-tabbar label[for=pbtab3],
  #pbtab4:checked~.pb-tabbar label[for=pbtab4],
  #pbtab5:checked~.pb-tabbar label[for=pbtab5]{background:linear-gradient(90deg,#3b82f6,#22d3ee);color:#fff;border-color:transparent;box-shadow:0 8px 18px rgba(59,130,246,.26);}
  #pbtab1:checked~.pb-panels .pb-panel-1,
  #pbtab2:checked~.pb-panels .pb-panel-2,
  #pbtab3:checked~.pb-panels .pb-panel-3,
  #pbtab4:checked~.pb-panels .pb-panel-4,
  #pbtab5:checked~.pb-panels .pb-panel-5{display:block;}
  .pb-home .pb-desc h3{font-size:clamp(24px,2.6vw,32px);margin:0 0 20px;}
  .pb-home .pb-pt{margin:0 0 16px;}
  .pb-home .pb-pt .k{display:block;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:4px;}
  .pb-home .pb-pt p{margin:0;color:var(--muted);font-size:15.5px;}
  .pb-home .pb-btn-grad{background:linear-gradient(90deg,#3b82f6,#22d3ee);color:#fff;box-shadow:0 8px 20px rgba(59,130,246,.28);margin-top:8px;}
  .pb-home .pb-btn-grad:hover{background:linear-gradient(90deg,#2563eb,#0891b2);transform:translateY(-1px);}
  /* ---- App-style live-preview widgets ---- */
  .pb-home .pb-idemo{--pbx-rose:#c81e63;--pbx-rose-bg:#fdeef4;--pbx-ink:#1f2430;--pbx-mut:#6b7280;}
  .pb-home .pb-pv{background:#fff;border:1px solid #dfe3ea;border-radius:16px;box-shadow:0 24px 60px rgba(20,30,60,.14);overflow:hidden;position:relative;}
  .pb-home .pb-pv-bar{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#f3f4f7;border-bottom:1px solid #e5e7eb;}
  .pb-home .pb-pv-bar .dots{display:flex;gap:6px;}
  .pb-home .pb-pv-bar .dots i{width:11px;height:11px;border-radius:50%;display:block;}
  .pb-home .pb-pv-bar .dots i:nth-child(1){background:#ff5f57;}
  .pb-home .pb-pv-bar .dots i:nth-child(2){background:#febc2e;}
  .pb-home .pb-pv-bar .dots i:nth-child(3){background:#28c840;}
  .pb-home .pb-pv-bar .ttl{font-size:12.5px;color:#8b93a1;font-weight:500;}
  /* ghost-cursor auto-demo */
  .pb-home .pb-ghost{position:absolute;left:0;top:0;width:26px;height:26px;z-index:12;pointer-events:none;opacity:0;transition:opacity .3s ease, transform 1.15s cubic-bezier(.45,.05,.2,1);filter:drop-shadow(0 3px 6px rgba(0,0,0,.32));will-change:transform;}
  .pb-home .pb-ghost.tap{transition:opacity .3s ease, transform .13s ease;}
  .pb-home .pb-ghost svg{width:100%;height:100%;display:block;}
  .pb-home .pb-ripple{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:rgba(59,130,246,.4);transform:translate(-50%,-50%) scale(0);pointer-events:none;opacity:0;z-index:11;}
  .pb-home .pb-ripple.go{animation:pbRipple .55s ease-out;}
  @keyframes pbRipple{0%{transform:translate(-50%,-50%) scale(.2);opacity:.55;}100%{transform:translate(-50%,-50%) scale(3.4);opacity:0;}}
  .pb-home .pb-trynudge{position:absolute;left:50%;bottom:18px;transform:translateX(-50%) translateY(10px);background:#1f2430;color:#fff;font-size:12.5px;font-weight:700;padding:9px 17px;border-radius:999px;box-shadow:0 12px 28px rgba(0,0,0,.3);opacity:0;pointer-events:none;transition:opacity .35s ease, transform .35s ease;white-space:nowrap;z-index:13;}
  .pb-home .pb-trynudge.show{opacity:1;transform:translateX(-50%) translateY(0);}
  @media(prefers-reduced-motion:reduce){.pb-home .pb-ghost,.pb-home .pb-ripple,.pb-home .pb-trynudge{display:none;}}
  .pb-home .pb-rt:hover,.pb-home .pb-csc:hover,.pb-home .pb-pack:hover,.pb-home .pb-boxt:hover,.pb-home .pb-mmcard:hover,.pb-home .pb-bpcard:hover,.pb-home .pb-boxopt:hover,.pb-home .pb-gift:hover{transform:translateY(-1px);}
  .pb-home .pb-pv-body{padding:20px;max-height:486px;overflow-y:auto;color:var(--pbx-ink);font-size:14px;}
  .pb-home .pb-pv-body::-webkit-scrollbar{width:8px;}
  .pb-home .pb-pv-body::-webkit-scrollbar-thumb{background:#dcdfe6;border-radius:8px;}
  .pb-home .pb-pp{display:grid;grid-template-columns:1fr 1.15fr;gap:18px;}
  .pb-home .pb-pp-img{border-radius:12px;background:#f3f1ee;aspect-ratio:1/1;overflow:hidden;position:sticky;top:0;align-self:start;}
  .pb-home .pb-pp-img img{width:100%;height:100%;object-fit:cover;display:block;}
  .pb-home .pb-pp h4{font-family:'Inter',sans-serif;font-weight:700;font-size:16px;margin:0 0 4px;color:var(--pbx-ink);}
  .pb-home .pb-pp .price{font-size:15px;font-weight:600;margin-bottom:12px;}
  .pb-home .pb-pp .price s{color:#9aa0ac;font-weight:400;font-size:13px;margin-left:5px;}
  .pb-home .pb-qty-l{font-size:12.5px;color:var(--pbx-mut);margin-bottom:5px;}
  .pb-home .pb-qty{display:inline-flex;align-items:center;border:1px solid #dfe3ea;border-radius:9px;overflow:hidden;margin-bottom:12px;}
  .pb-home .pb-qty button{width:32px;height:32px;border:0;background:#fff;color:var(--pbx-ink);font-size:16px;cursor:pointer;}
  .pb-home .pb-qty button:hover{background:#f5f6f8;}
  .pb-home .pb-qty .n{min-width:30px;text-align:center;font-size:14px;font-weight:600;}
  .pb-home .pb-atc{display:block;width:100%;text-align:center;border:1px solid #cfd4dd;background:#fff;color:var(--pbx-ink);font-weight:600;font-size:14px;border-radius:10px;padding:11px;cursor:pointer;margin-bottom:14px;}
  .pb-home .pb-atc:hover{background:#f7f8fa;}
  .pb-home .pb-dbox{border:1px solid #f3c6da;border-radius:12px;padding:14px;position:relative;}
  .pb-home .pb-dbox-t{color:var(--pbx-rose);font-weight:700;font-size:13.5px;margin-bottom:4px;}
  .pb-home .pb-dbox-s{color:var(--pbx-mut);font-size:12px;margin-bottom:12px;line-height:1.45;}
  .pb-home .pb-rt{display:flex;align-items:center;gap:10px;border:1px solid #e7e2ec;border-radius:10px;padding:11px 12px;margin-bottom:8px;cursor:pointer;position:relative;transition:all .15s ease;min-height:70px;}
  .pb-home .pb-rt:hover{border-color:#f3c6da;}
  .pb-home .pb-rt.sel{border-color:var(--pbx-rose);background:var(--pbx-rose-bg);}
  .pb-home .pb-rt .rc{width:16px;height:16px;border-radius:50%;border:2px solid #cfa9bd;flex:none;}
  .pb-home .pb-rt.sel .rc{border-color:var(--pbx-rose);background:radial-gradient(circle at center,var(--pbx-rose) 0 3px,#fff 4px 6px,var(--pbx-rose) 7px);}
  .pb-home .pb-rt .lab{font-weight:700;font-size:13.5px;white-space:nowrap;}
  .pb-home .pb-rt .off{display:inline-block;background:#fbdceb;color:var(--pbx-rose);font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:6px;margin-left:6px;white-space:nowrap;}
  .pb-home .pb-rt .pz{margin-left:auto;font-size:13.5px;font-weight:600;}
  .pb-home .pb-rt .pz s{color:#9aa0ac;font-weight:400;font-size:12px;margin-left:4px;}
  .pb-home .pb-rt .pop{position:absolute;top:-9px;right:10px;background:var(--pbx-rose);color:#fff;font-size:9.5px;font-weight:700;padding:2px 8px;border-radius:6px;letter-spacing:.03em;}
  .pb-home .pb-vslots{margin:6px 0 9px;display:flex;flex-direction:column;gap:6px;}
  .pb-home .pb-vslot{display:flex;align-items:center;gap:9px;}
  .pb-home .pb-vslot .ix{font-size:12px;font-weight:700;color:var(--pbx-mut);width:22px;flex:none;}
  .pb-home .pb-vslot select{flex:1;border:1px solid #dfe3ea;border-radius:8px;padding:8px 10px;font-size:12.5px;color:var(--pbx-ink);background:#fff;cursor:pointer;}
  .pb-home .pb-gifts{border:1px solid #bcd6b4;border-radius:11px;padding:11px;margin-top:12px;background:#e9f1e7;}
  .pb-home .pb-gifts-h{font-size:12px;font-weight:700;color:#2f5d50;margin-bottom:9px;}
  .pb-home .pb-gifts-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
  .pb-home .pb-gift{border:1px solid #d3e4cc;border-radius:9px;padding:9px 6px;text-align:center;cursor:pointer;position:relative;transition:all .15s;background:#f3f8f1;}
  .pb-home .pb-gift:hover{border-color:#9fc093;}
  .pb-home .pb-gift img{width:48px;height:48px;object-fit:cover;display:block;margin:0 auto 5px;border-radius:8px;background:#fff;filter:grayscale(1);opacity:.5;transition:all .15s;}
  .pb-home .pb-gift .gl{font-size:10.5px;font-weight:600;color:#5f7159;line-height:1.25;display:block;}
  .pb-home .pb-gift .lk{position:absolute;top:5px;right:6px;font-size:10px;opacity:.55;}
  .pb-home .pb-gift.unlocked{border-color:#2f5d50;background:#dcecd5;}
  .pb-home .pb-gift.unlocked img{filter:none;opacity:1;}
  .pb-home .pb-gift.unlocked .gl{color:#2f5d50;}
  .pb-home .pb-gift.unlocked .lk{display:none;}
  .pb-home .pb-gift .gi-ship{margin:0 auto 5px;height:48px;display:flex;align-items:center;justify-content:center;}
  .pb-home .pb-gift .gi-ship svg{width:42px;height:42px;color:#8fae86;transition:color .15s;}
  .pb-home .pb-gift.unlocked .gi-ship svg{color:#2f5d50;}
  .pb-home .pb-atc.solid{background:var(--pbx-rose);color:#fff;border-color:var(--pbx-rose);margin-top:12px;margin-bottom:0;}
  .pb-home .pb-atc.solid:hover{background:#a81551;}
  .pb-home .pb-toast{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.94);background:rgba(240,253,244,.92);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);border:1.5px solid #86efac;color:#15803d;padding:26px 32px;border-radius:16px;box-shadow:0 22px 52px rgba(21,128,61,.20);opacity:0;pointer-events:none;transition:all .24s ease;z-index:6;text-align:center;max-width:78%;}
  .pb-home .pb-toast.show{opacity:1;transform:translate(-50%,-50%) scale(1);}
  .pb-home .pb-toast .tk{width:42px;height:42px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px;box-shadow:0 6px 16px rgba(34,197,94,.35);}
  .pb-home .pb-toast .msg{font-size:14px;font-weight:600;line-height:1.4;}
  .pb-home .pb-drawer-mask{position:absolute;inset:0;background:rgba(20,25,40,.34);opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:8;}
  .pb-home .pb-drawer-mask.show{opacity:1;pointer-events:auto;}
  .pb-home .pb-drawer{position:absolute;top:0;right:0;height:100%;width:84%;max-width:340px;background:#fff;box-shadow:-14px 0 44px rgba(0,0,0,.2);transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);z-index:9;display:flex;flex-direction:column;}
  .pb-home .pb-drawer.show{transform:translateX(0);}
  .pb-home .pb-drawer-h{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #eceef2;font-weight:700;font-size:14px;color:var(--pbx-ink);}
  .pb-home .pb-drawer-h .x{cursor:pointer;color:#9aa0ac;font-size:16px;line-height:1;}
  .pb-home .pb-drawer-body{flex:1;overflow-y:auto;padding:14px 16px;}
  .pb-home .pb-bundle{border:1px solid #eceef2;border-radius:12px;padding:12px;}
  .pb-home .pb-bundle-top{display:flex;align-items:center;gap:10px;}
  .pb-home .pb-bundle-top .bt-thumb{width:44px;height:44px;border-radius:8px;object-fit:cover;background:#f3f1ee;flex:none;}
  .pb-home .pb-bundle-top .bt-n{flex:1;font-size:12.5px;font-weight:700;line-height:1.3;color:var(--pbx-ink);}
  .pb-home .pb-bundle-top .bt-n small{display:block;font-weight:400;color:#9aa0ac;font-size:10.5px;margin-top:2px;}
  .pb-home .pb-bundle-top .bt-p{font-size:13px;font-weight:700;color:var(--pbx-ink);}
  .pb-home .pb-bundle-toggle{font-size:11.5px;color:var(--pbx-rose);font-weight:700;cursor:pointer;margin:11px 0 7px;display:inline-block;}
  .pb-home .pb-bundle-items{border-left:2px solid #eceef2;padding-left:11px;margin-left:5px;}
  .pb-home .pb-bitem{display:flex;align-items:center;gap:9px;padding:6px 0;font-size:12px;color:var(--pbx-ink);}
  .pb-home .pb-bitem img{width:30px;height:30px;border-radius:6px;object-fit:cover;background:#f3f1ee;flex:none;}
  .pb-home .pb-bitem .bi-n{flex:1;line-height:1.3;}
  .pb-home .pb-bitem .bi-n small{color:#9aa0ac;}
  .pb-home .pb-drawer-foot{border-top:1px solid #eceef2;padding:14px 16px;}
  .pb-home .pb-drawer-foot .row{display:flex;justify-content:space-between;font-size:14px;font-weight:700;margin-bottom:10px;color:var(--pbx-ink);}
  .pb-home .pb-drawer-checkout{display:block;text-align:center;background:#1f2430;color:#fff;font-weight:600;border-radius:10px;padding:12px;font-size:14px;cursor:pointer;}
  .pb-home .pb-drawer-checkout:hover{background:#000;}
  .pb-home .pb-cs{display:flex;align-items:center;gap:10px;border:1px solid #e7e2ec;border-radius:10px;padding:9px 11px;cursor:pointer;transition:all .15s ease;}
  .pb-home .pb-cs.on{border-color:var(--pbx-rose);background:var(--pbx-rose-bg);}
  .pb-home .pb-cs img{width:34px;height:34px;border-radius:7px;object-fit:cover;background:#f3f1ee;flex:none;}
  .pb-home .pb-cs .nm{flex:1;font-size:13px;font-weight:600;}
  .pb-home .pb-cs .pz{font-size:13px;font-weight:600;}
  .pb-home .pb-cs-sub{display:flex;gap:8px;align-items:center;margin:6px 0 0 44px;}
  .pb-home .pb-qchip{background:#f1f2f5;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;color:var(--pbx-mut);}
  .pb-home .pb-vsel{border:1px solid #dfe3ea;border-radius:7px;font-size:12px;padding:4px 9px;color:var(--pbx-ink);background:#fff;}
  .pb-home .pb-plus{text-align:center;color:var(--pbx-rose);font-size:18px;font-weight:700;margin:6px 0;}
  .pb-home .pb-csc{border:1px solid #e7e2ec;border-radius:11px;padding:10px 11px;cursor:pointer;transition:all .15s;}
  .pb-home .pb-csc:hover{border-color:#f3c6da;}
  .pb-home .pb-csc.on{border-color:#e3e5f0;background:#ffffff;}
  .pb-home .pb-csc .csc-top{display:flex;align-items:center;gap:10px;}
  .pb-home .pb-csc .csc-top img{width:38px;height:38px;border-radius:8px;object-fit:cover;background:#f3f1ee;flex:none;}
  .pb-home .pb-csc .csc-top .nm{flex:1;font-size:13px;font-weight:600;}
  .pb-home .pb-csc .csc-top .pz{font-size:13px;font-weight:600;}
  .pb-home .pb-csc .csc-sub{display:flex;align-items:center;gap:8px;margin:1px 0 0 48px;}
  .pb-home .pb-vsel2{border:1px solid #dfe3ea;border-radius:7px;font-size:12px;padding:4px 8px;color:var(--pbx-ink);background:#fff;cursor:pointer;width: 80%;min-height: 34px;}
  .pb-home .pb-packs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
  .pb-home .pb-pack{border:1px solid #e7e2ec;border-radius:10px;padding:9px 14px;cursor:pointer;transition:all .15s ease;min-width:96px;}
  .pb-home .pb-pack:hover{border-color:#f3c6da;}
  .pb-home .pb-pack.sel{border-color:var(--pbx-rose);background:var(--pbx-rose);color:#fff;}
  .pb-home .pb-pack b{display:block;font-size:13.5px;}
  .pb-home .pb-pack span{font-size:11.5px;opacity:.85;}
  .pb-home .pb-slots-l{font-size:13px;font-weight:600;margin-bottom:8px;}
  .pb-home .pb-slots{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
  .pb-home .pb-slot{width:46px;height:46px;border-radius:9px;border:1.5px dashed #d9dae0;background:#fafafb;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:all .15s;font-size:18px;color:#c9ccd4;}
  .pb-home .pb-slot.on{border-style:solid;border-color:var(--pbx-rose);background:var(--pbx-rose-bg);color:transparent;}
  .pb-home .pb-slot img{width:100%;height:100%;object-fit:cover;}
  .pb-home .pb-mmg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;}
  .pb-home .pb-mmcard{border:1px solid #eceef2;border-radius:10px;padding:8px;text-align:center;background:#fff;}
  .pb-home .pb-mmcard img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:7px;background:#f3f1ee;display:block;}
  .pb-home .pb-mmcard .n{font-size:12px;font-weight:600;margin:6px 0 1px;line-height:1.25;}
  .pb-home .pb-mmcard .p{font-size:12px;color:var(--pbx-mut);margin-bottom:7px;}
  .pb-home .pb-addbtn{display:block;width:100%;border:1px solid var(--pbx-rose);color:var(--pbx-rose);background:#fff;border-radius:8px;padding:7px;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .15s;}
  .pb-home .pb-addbtn:hover{background:var(--pbx-rose);color:#fff;}
  .pb-home .pb-addbtn.dis{opacity:.4;cursor:default;pointer-events:none;}
  .pb-home .pb-mmcard .op{color:#9aa0ac;text-decoration:line-through;font-size:11px;margin-right:3px;}
  .pb-home .pb-mmcard .off{display:inline-block;background:#fbdceb;color:var(--pbx-rose);font-size:9px;font-weight:700;padding:1px 5px;border-radius:5px;margin-left:3px;vertical-align:middle;}
  .pb-home .pb-mmcard .stock{font-size:10px;color:#22a06b;font-weight:600;margin-bottom:6px;}
  .pb-home .pb-mmfoot{position:sticky;top:0;z-index:3;background:#fff;padding:8px 0 10px;margin-bottom:8px;border-bottom:1px solid #eceef2;}
  .pb-home .pb-atc.cartbtn{display:flex;justify-content:space-between;gap:10px;}
  .pb-home .pb-atc.cartbtn.muted{background:#f1f2f5;color:#9aa0ac;border-color:#f1f2f5;cursor:default;justify-content:center;}
  .pb-home .pb-mm-tot{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;margin-top:4px;}
  .pb-home .pb-mm-tot s{color:#9aa0ac;font-weight:400;font-size:12px;margin-right:5px;}
  .pb-home .pb-boxtiers{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;}
  .pb-home .pb-boxt{border:1px solid #e7e2ec;border-radius:10px;padding:9px 6px;text-align:center;cursor:pointer;transition:all .15s;}
  .pb-home .pb-boxt:hover{border-color:#c9ccd6;}
  .pb-home .pb-boxt.sel{border-color:#1f2430;background:#1f2430;color:#fff;}
  .pb-home .pb-boxt .bt-h{font-size:9px;letter-spacing:.05em;opacity:.72;font-weight:700;display:block;}
  .pb-home .pb-boxt .bt-o{display:inline-block;margin-top:5px;font-size:11px;font-weight:700;color:var(--pbx-rose);background:#fbdceb;padding:2px 7px;border-radius:6px;}
  .pb-home .pb-boxt.sel .bt-o{color:#fff;background:var(--pbx-rose);}
  .pb-home .pb-boxt .bt-r{display:inline-block;margin-top:5px;font-size:11px;font-weight:700;}
  .pb-home .pb-cats{display:flex;gap:16px;border-bottom:1px solid #eceef2;margin-bottom:12px;}
  .pb-home .pb-cat{font-size:13px;font-weight:600;color:var(--pbx-mut);padding-bottom:8px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}
  .pb-home .pb-cat.on{color:var(--pbx-rose);border-color:var(--pbx-rose);}
  .pb-home .pb-mmm{display:grid;grid-template-columns:1.35fr .95fr;gap:14px;}
  .pb-home .pb-pgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .pb-home .pb-pcard .pc-img{border-radius:9px;background:#f3f1ee;aspect-ratio:1/1;overflow:hidden;}
  .pb-home .pb-pcard .pc-img img{width:100%;height:100%;object-fit:cover;}
  .pb-home .pb-pcard .pc-n{font-size:12.5px;font-weight:600;margin:6px 0 1px;}
  .pb-home .pb-pcard .pc-p{font-size:12px;color:var(--pbx-mut);margin-bottom:6px;}
  .pb-home .pb-pcard .pb-qty{margin-bottom:0;}
  .pb-home .pb-mypack{background:#faf9fb;border:1px solid #eceef2;border-radius:11px;padding:13px;height:fit-content;}
  .pb-home .pb-mypack .mp-h{font-weight:700;font-size:13.5px;display:flex;align-items:center;gap:7px;margin-bottom:10px;}
  .pb-home .pb-mypack .mp-b{background:var(--pbx-rose);color:#fff;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:999px;}
  .pb-home .pb-mypack .mp-empty{border:1px dashed #d9dae0;border-radius:9px;padding:12px;font-size:12px;color:var(--pbx-mut);text-align:center;margin-bottom:10px;line-height:1.4;}
  .pb-home .pb-mypack .mp-list{margin-bottom:10px;}
  .pb-home .pb-mypack .mp-item{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:4px 0;color:var(--pbx-ink);}
  .pb-home .pb-mypack .mp-item .l{display:flex;align-items:center;gap:7px;min-width:0;}
  .pb-home .pb-mypack .mp-item .l img{width:26px;height:26px;border-radius:6px;object-fit:cover;background:#f3f1ee;flex:none;}
  .pb-home .pb-mypack .mp-item .l span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .pb-home .pb-mypack .mp-guide{font-size:11.5px;color:var(--pbx-rose);font-weight:600;text-align:center;padding:8px;border:1px dashed #e2b8cd;border-radius:8px;margin-bottom:10px;background:var(--pbx-rose-bg);}
  .pb-home .pb-mypack .mp-cart{display:flex;justify-content:space-between;font-size:13px;font-weight:700;border-top:1px solid #eceef2;padding-top:9px;}
  .pb-home .pb-mypack .mp-addcart{border-top:none;background:var(--pbx-rose);color:#fff;border-radius:9px;padding:11px 13px;margin-top:10px;cursor:pointer;transition:all .15s;}
  .pb-home .pb-mypack .mp-addcart:hover{background:#a81551;}
  .pb-home .pb-mypack .mp-addcart.dis{background:#f1f2f5;color:#9aa0ac;cursor:default;}
  .pb-home .pb-byob-h{text-align:center;margin-bottom:6px;}
  .pb-home .pb-byob-h h4{font-family:'Fraunces',serif;font-weight:600;font-size:19px;margin:0 0 5px;}
  .pb-home .pb-byob-h p{font-size:12px;color:var(--pbx-mut);margin:0 0 9px;}
  .pb-home .pb-byob-h .pill{display:inline-block;background:var(--pbx-rose-bg);color:var(--pbx-rose);font-size:11.5px;font-weight:700;padding:5px 12px;border-radius:999px;}
  .pb-home .pb-track{display:flex;align-items:flex-start;margin:16px 0;}
  .pb-home .pb-track .stp{flex:1;text-align:center;position:relative;}
  .pb-home .pb-track .stp .cir{width:26px;height:26px;border-radius:50%;background:#eceef2;color:var(--pbx-mut);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 5px;position:relative;z-index:2;}
  .pb-home .pb-track .stp.on .cir{background:var(--pbx-rose);color:#fff;}
  .pb-home .pb-track .stp.done .cir{background:var(--pbx-rose);color:#fff;}
  .pb-home .pb-track .stp .cl{font-size:10px;color:var(--pbx-mut);}
  .pb-home .pb-track .stp.on .cl{color:var(--pbx-ink);font-weight:600;}
  .pb-home .pb-track .stp:not(:last-child):after{content:'';position:absolute;top:13px;left:50%;width:100%;height:2px;background:#eceef2;z-index:1;}
  .pb-home .pb-track .stp.done:not(:last-child):after{background:var(--pbx-rose);}
  .pb-home .pb-byob-body{min-height:150px;}
  .pb-home .pb-byob-sub{font-weight:600;font-size:13.5px;margin-bottom:10px;}
  .pb-home .pb-boxpick{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .pb-home .pb-boxopt{border:1px solid #e7e2ec;border-radius:11px;overflow:hidden;cursor:pointer;transition:all .15s;}
  .pb-home .pb-boxopt.sel{border-color:var(--pbx-rose);box-shadow:0 0 0 1px var(--pbx-rose);}
  .pb-home .pb-boxopt .bi{aspect-ratio:4/3;background:#f3f1ee;overflow:hidden;}
  .pb-home .pb-boxopt .bi img{width:100%;height:100%;object-fit:cover;}
  .pb-home .pb-boxopt .bn{font-size:12px;font-weight:600;padding:8px;text-align:center;}
  .pb-home .pb-opt{display:flex;justify-content:space-between;align-items:center;border:1px solid #e7e2ec;border-radius:10px;padding:11px 13px;margin-bottom:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;}
  .pb-home .pb-opt.sel{border-color:var(--pbx-rose);background:var(--pbx-rose-bg);}
  .pb-home .pb-opt .pr{color:var(--pbx-mut);font-weight:600;}
  .pb-home .pb-byob-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #eceef2;padding-top:12px;margin-top:14px;font-size:12.5px;color:var(--pbx-mut);}
  .pb-home .pb-byob-foot .tot{color:var(--pbx-ink);font-weight:700;}
  .pb-home .pb-byob-foot .tot s{color:#9aa0ac;font-weight:400;margin-right:5px;}
  .pb-home .pb-byob-nav2{display:flex;gap:10px;margin-top:12px;}
  .pb-home .pb-byob-nav2 button{flex:1;border-radius:9px;padding:11px;font-family:'Inter',sans-serif;font-weight:600;font-size:13.5px;cursor:pointer;border:1px solid #dfe3ea;background:#fff;color:var(--pbx-ink);transition:all .15s;}
  .pb-home .pb-byob-nav2 button:hover:not(:disabled){background:#f7f8fa;}
  .pb-home .pb-byob-nav2 .nx{flex:2;background:var(--pbx-rose);color:#fff;border-color:var(--pbx-rose);}
  .pb-home .pb-byob-nav2 .nx:hover:not(:disabled){background:#a81551;}
  .pb-home .pb-byob-nav2 button:disabled{opacity:.45;cursor:default;}
  .pb-home .pb-byob-thumbs{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
  .pb-home .pb-byob-thumb{position:relative;width:34px;height:34px;border-radius:7px;overflow:hidden;border:1px solid #eceef2;background:#f3f1ee;}
  .pb-home .pb-byob-thumb img{width:100%;height:100%;object-fit:cover;}
  .pb-home .pb-byob-thumb .rm{position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;background:var(--pbx-rose);color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;border:1.5px solid #fff;}
  .pb-home .pb-byob-empty{font-size:12px;color:var(--pbx-mut);}
  .pb-home .pb-byob-sub2{display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:13.5px;margin-bottom:10px;}
  .pb-home .pb-byob-sub2 .sel-c{font-size:11.5px;color:var(--pbx-mut);font-weight:600;}
  .pb-home .pb-bpgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;}
  .pb-home .pb-bpcard{border:1px solid #eceef2;border-radius:10px;padding:8px;text-align:center;}
  .pb-home .pb-bpcard.on{border-color:var(--pbx-rose);box-shadow:0 0 0 1px var(--pbx-rose);}
  .pb-home .pb-bpcard img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:7px;background:#f3f1ee;}
  .pb-home .pb-bpcard .n{font-size:11.5px;font-weight:600;margin:5px 0 1px;line-height:1.2;}
  .pb-home .pb-bpcard .p{font-size:11px;color:var(--pbx-mut);margin-bottom:6px;}
  .pb-home .pb-bform label{display:block;font-size:12px;font-weight:600;margin:10px 0 4px;color:var(--pbx-ink);}
  .pb-home .pb-bform input,.pb-home .pb-bform textarea{width:100%;border:1px solid #dfe3ea;border-radius:9px;padding:9px 11px;font-size:13px;font-family:inherit;color:var(--pbx-ink);box-sizing:border-box;}
  .pb-home .pb-bform textarea{min-height:58px;resize:none;}
  @media(max-width:860px){
    .pb-home .pb-panel-grid{grid-template-columns:1fr;gap:30px;}
    .pb-home .pb-idemo .pb-pv{order:-1;}
    .pb-home .pb-pp{grid-template-columns:1fr;}
    .pb-home .pb-mmm{grid-template-columns:1fr;}
    .pb-home .pb-boxtiers{grid-template-columns:repeat(2,1fr);}
  }
`;

const HTML = String.raw`
  <section class="pb-idemo">
    <input class="pb-tabs-input" type="radio" name="pbtab" id="pbtab1" checked>
    <input class="pb-tabs-input" type="radio" name="pbtab" id="pbtab2">
    <input class="pb-tabs-input" type="radio" name="pbtab" id="pbtab3">
    <input class="pb-tabs-input" type="radio" name="pbtab" id="pbtab4">
    <input class="pb-tabs-input" type="radio" name="pbtab" id="pbtab5">

    <div class="pb-wrap">
      <div class="pb-sec-head">
        <span class="pb-eyebrow">Interactive demo</span>
        <h2>Your all-in-one bundle builder</h2>
        <p>Every bundle type shoppers love — in one app. Pick a tab to explore each one, then try it live.</p>
      </div>
    </div>

    <div class="pb-wrap pb-tabbar">
      <label class="pb-tab" for="pbtab1"><span class="ti">◱</span> Volume Bundle</label>
      <label class="pb-tab" for="pbtab2"><span class="ti">🛒</span> Cross-Sell</label>
      <label class="pb-tab" for="pbtab3"><span class="ti">✦</span> Mix &amp; Match (Single)</label>
      <label class="pb-tab" for="pbtab4"><span class="ti">▦</span> Mix &amp; Match (Multi)</label>
      <label class="pb-tab" for="pbtab5"><span class="ti">✧</span> Build Your Own Box</label>
    </div>

    <div class="pb-wrap pb-panels">

      <div class="pb-panel pb-panel-1">
        <div class="pb-panel-grid">
          <div class="pb-pv" id="pbw-vol">
            <div class="pb-pv-bar"><span class="dots"><i></i><i></i><i></i></span><span class="ttl">Volume Bundle</span></div>
            <div class="pb-pv-body">
              <div class="pb-pp">
                <div class="pb-pp-img"><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-vitamin-c-skincare-serum-in-a-frosted-amber-glass-dropper-bottle-minimalist-white-label-standing-on-a-smooth-marble-surface-soft-natural-studio-lighting-clean-light-beige-ba.png?v=1784800605" alt=""></div>
                <div>
                  <h4>Vitamin C Brightening Serum</h4>
                  <div class="price">$24.00 <span style="color:#9aa0ac;font-weight:400;font-size:12px;">USD</span></div>
                  <div class="pb-qty-l">Quantity</div>
                  <div class="pb-qty"><button type="button" data-q="-1">−</button><span class="n">1</span><button type="button" data-q="1">+</button></div>
                  <div class="pb-dbox">
                    <div class="pb-dbox-t">Buy more &amp; save up to 15%</div>
                    <div class="pb-dbox-s">Order more units of this product in one go and unlock a bigger discount on every piece.</div>
                    <div class="pb-rt" data-qty="2" data-disc="0.05"><span class="rc"></span><span class="lab">Buy 2 <span class="off">5% off</span></span><span class="pz">$45.60 <s>$48.00</s></span></div>
                    <div class="pb-rt sel" data-qty="4" data-disc="0.10"><span class="pop">Most popular</span><span class="rc"></span><span class="lab">Buy 4 <span class="off">10% off</span></span><span class="pz">$86.40 <s>$96.00</s></span></div>
                    <div class="pb-rt" data-qty="6" data-disc="0.15"><span class="rc"></span><span class="lab">Buy 6 <span class="off">15% off</span></span><span class="pz">$122.40 <s>$144.00</s></span></div>
                    <div class="pb-vslots"></div>
                    <div class="pb-gifts">
                      <div class="pb-gifts-h">Free gifts &amp; shipping with your order</div>
                      <div class="pb-gifts-row">
                        <div class="pb-gift" data-unlock="2"><span class="lk">🔒</span><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-revitalizing-face-sheet-mask-in-a-flat-foil-sachet-packet-with-a-minimalist-pastel-green-label-lying-flat-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-backgro.png?v=1784802926" alt=""><span class="gl">Free Sheet Mask</span></div>
                        <div class="pb-gift" data-unlock="4"><span class="lk">🔒</span><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-hyaluronic-acid-hydrating-serum-in-a-frosted-clear-glass-dropper-bottle-with-a-soft-blue-tint-minimalist-white-label-on-a-smooth-marble-surface-soft-studio-lighting-clean-li.png?v=1784800834" alt=""><span class="gl">Free Travel Serum</span></div>
                        <div class="pb-gift" data-unlock="6"><span class="lk">🔒</span><span class="gi-ship"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 5h13v10.5h-13z"/><path d="M14.5 8.5h4L22 12v3.5h-7.5z"/><circle cx="5.5" cy="17.8" r="2.1"/><circle cx="17.8" cy="17.8" r="2.1"/></svg></span><span class="gl">Free Shipping</span></div>
                      </div>
                    </div>
                    <div class="pb-atc solid" data-cart="1">Add to Cart</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pb-toast"><div class="tk">✓</div><div class="msg">Your bundle has been added to the cart</div></div>
          </div>
          <div class="pb-desc">
            <h3>Volume Bundle</h3>
            <div class="pb-pt"><span class="k">How it works</span><p>Set tiers like Buy 2 / 4 / 6, each with its own discount. The shopper picks a tier, chooses variants to fill the pack, and the total + savings update live before adding to cart.</p></div>
            <div class="pb-pt"><span class="k">Benefits</span><p>Lift average order value with quantity breaks that reward bigger carts — ideal for wholesale, multipacks and stock-up staples — while you keep full control over every tier and discount.</p></div>
            <div class="pb-pt"><span class="k">Flexibility</span><p>Show tiers as a compact list or cards, on the product page or a dedicated bundle page, in portrait or horizontal layouts — all styled to match your theme.</p></div>
            <a href="https://apps.shopify.com/push-bundle" target="_blank" rel="noopener noreferrer" class="pb-btn pb-btn-grad">Experience Volume Bundle ↗</a>
          </div>
        </div>
      </div>

      <div class="pb-panel pb-panel-2">
        <div class="pb-panel-grid">
          <div class="pb-pv" id="pbw-cross">
            <div class="pb-pv-bar"><span class="dots"><i></i><i></i><i></i></span><span class="ttl">Cross-Sell Bundle</span></div>
            <div class="pb-pv-body">
              <div class="pb-pp">
                <div class="pb-pp-img"><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-daily-glow-face-moisturizer-in-a-white-ceramic-jar-with-a-minimalist-label-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-background-professional-product-photog.png?v=1784802185" alt=""></div>
                <div>
                  <h4>Daily Glow Moisturizer</h4>
                  <div class="price">$22.00 <span style="color:#9aa0ac;font-weight:400;font-size:12px;">USD</span></div>
                  <div class="pb-qty-l">Quantity</div>
                  <div class="pb-qty"><button type="button" data-q="-1">−</button><span class="n">1</span><button type="button" data-q="1">+</button></div>
                  <div class="pb-dbox">
                    <div class="pb-dbox-t">Buy together and save 10%</div>
                    <div class="pb-dbox-s">Enjoy exclusive savings — buy these favourites together in one bundle and get 10% off your total.</div>
                    <div class="pb-csc on" data-price="24">
                      <div class="csc-top"><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-vitamin-c-skincare-serum-in-a-frosted-amber-glass-dropper-bottle-minimalist-white-label-standing-on-a-smooth-marble-surface-soft-natural-studio-lighting-clean-light-beige-ba.png?v=1784800605" alt=""><span class="nm">Vitamin C Serum</span><span class="pz">$24.00</span></div>
                      <div class="csc-sub"><span class="pb-qchip">×1</span><select class="pb-vsel2"><option>30 ml</option><option>50 ml</option></select></div>
                    </div>
                    <div class="pb-plus">+</div>
                    <div class="pb-csc on" data-price="18">
                      <div class="csc-top"><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-gentle-foaming-facial-cleanser-in-a-white-pump-bottle-minimalist-label-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-background-professional-product-photograph.png?v=1784801818" alt=""><span class="nm">Gentle Foaming Cleanser</span><span class="pz">$18.00</span></div>
                      <div class="csc-sub"><span class="pb-qchip">×1</span><select class="pb-vsel2"><option>Standard</option><option>Sensitive</option></select></div>
                    </div>
                    <div class="pb-plus">+</div>
                    <div class="pb-csc on" data-price="8">
                      <div class="csc-top"><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-revitalizing-face-sheet-mask-in-a-flat-foil-sachet-packet-with-a-minimalist-pastel-green-label-lying-flat-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-backgro.png?v=1784802926" alt=""><span class="nm">Revitalizing Sheet Mask</span><span class="pz">$8.00</span></div>
                      <div class="csc-sub"><span class="pb-qchip">×1</span><select class="pb-vsel2"><option>Single</option><option>Pack of 3</option></select></div>
                    </div>
                    <div class="pb-mm-tot" style="margin-top:14px;"><span class="cst">Total (3 items)</span><span><s class="orig"></s><span class="now"></span></span></div>
                    <div class="pb-atc solid" data-cart="1">Add bundle &amp; save 10%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pb-toast"><div class="tk">✓</div><div class="msg">Your bundle has been added to the cart</div></div>
          </div>
          <div class="pb-desc">
            <h3>Cross-Sell Bundle</h3>
            <div class="pb-pt"><span class="k">How it works</span><p>Group products that sell well together and apply a bundle discount — customers add the whole set in a single click.</p></div>
            <div class="pb-pt"><span class="k">Benefits</span><p>Increase AOV by pairing complementary products at a bundled price — a proven upsell that turns one purchase into a complete set without extra clicks.</p></div>
            <div class="pb-pt"><span class="k">Flexibility</span><p>Curate the exact set, fix or expose quantities, and let shoppers choose variants — shown right on the product page or as a 'frequently bought together' block.</p></div>
            <a href="https://apps.shopify.com/push-bundle" target="_blank" rel="noopener noreferrer" class="pb-btn pb-btn-grad">Experience Cross-Sell ↗</a>
          </div>
        </div>
      </div>

      <div class="pb-panel pb-panel-3">
        <div class="pb-panel-grid">
          <div class="pb-pv" id="pbw-mms">
            <div class="pb-pv-bar"><span class="dots"><i></i><i></i><i></i></span><span class="ttl">Mix &amp; Match — Single Product</span></div>
            <div class="pb-pv-body">
              <div class="pb-pp">
                <div class="pb-pp-img"><img src="https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-revitalizing-face-sheet-mask-in-a-flat-foil-sachet-packet-with-a-minimalist-pastel-green-label-lying-flat-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-backgro.png?v=1784802926" alt=""></div>
                <div>
                  <h4>Build Your Mask Pack</h4>
                  <div class="price">$8.00 <span style="color:#9aa0ac;font-weight:400;font-size:12px;">USD</span></div>
                  <div class="pb-qty-l">Quantity</div>
                  <div class="pb-qty"><button type="button" data-q="-1">−</button><span class="n">1</span><button type="button" data-q="1">+</button></div>
                  <div class="pb-dbox">
                    <div class="pb-dbox-t">Choose a pack</div>
                    <div class="pb-packs">
                      <div class="pb-pack sel" data-size="3" data-disc="0.10"><b>Pick 3</b><span>Save 10%</span></div>
                      <div class="pb-pack" data-size="5" data-disc="0.15"><b>Pick 5</b><span>Save 15%</span></div>
                      <div class="pb-pack" data-size="8" data-disc="0.20"><b>Pick 8</b><span>Save 20%</span></div>
                    </div>
                    <div class="pb-mmfoot">
                      <div class="pb-slots-l">Selected products <span class="cnt">0/3</span></div>
                      <div class="pb-slots"></div>
                      <div class="pb-atc solid cartbtn muted">Add 3 more</div>
                    </div>
                    <div class="pb-mmg"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pb-drawer-mask"></div>
            <div class="pb-drawer">
              <div class="pb-drawer-h"><span>Your cart</span><span class="x">✕</span></div>
              <div class="pb-drawer-body"></div>
              <div class="pb-drawer-foot"><div class="row"><span>Subtotal</span><span class="dsub">$0.00</span></div><div class="pb-drawer-checkout">Checkout</div></div>
            </div>
          </div>
          <div class="pb-desc">
            <h3>Mix &amp; Match — Single Product</h3>
            <div class="pb-pt"><span class="k">How it works</span><p>Pick a product, choose the pack sizes, and shoppers assemble their own mix with the discount applied as the box fills.</p></div>
            <div class="pb-pt"><span class="k">Benefits</span><p>Boost engagement and AOV by letting shoppers build their own pack from one product's variants — perfect for colour packs, sample sets, and subscription-style boxes.</p></div>
            <div class="pb-pt"><span class="k">Flexibility</span><p>Set pack sizes and tiered pricing, cap quantities per variant, and display it as a compact grid or a full page — portrait or horizontal to fit any theme.</p></div>
            <a href="https://apps.shopify.com/push-bundle" target="_blank" rel="noopener noreferrer" class="pb-btn pb-btn-grad">Experience Mix &amp; Match ↗</a>
          </div>
        </div>
      </div>

      <div class="pb-panel pb-panel-4">
        <div class="pb-panel-grid">
          <div class="pb-pv" id="pbw-mmm">
            <div class="pb-pv-bar"><span class="dots"><i></i><i></i><i></i></span><span class="ttl">Mix &amp; Match — Multiple Products</span></div>
            <div class="pb-pv-body">
              <div class="pb-boxtiers">
                <div class="pb-boxt" data-size="4" data-disc="0"><span class="bt-h">BOX OF 4 ITEMS</span><span class="bt-r">Regular</span></div>
                <div class="pb-boxt sel" data-size="6" data-disc="0.10"><span class="bt-h">BOX OF 6 ITEMS</span><span class="bt-o">10% OFF</span></div>
                <div class="pb-boxt" data-size="8" data-disc="0.12"><span class="bt-h">BOX OF 8 ITEMS</span><span class="bt-o">12% OFF</span></div>
                <div class="pb-boxt" data-size="10" data-disc="0.15"><span class="bt-h">BOX OF 10 ITEMS</span><span class="bt-o">15% OFF</span></div>
              </div>
              <div class="pb-cats">
                <span class="pb-cat on" data-cat="skin">Skincare</span>
                <span class="pb-cat" data-cat="serum">Serums</span>
                <span class="pb-cat" data-cat="mask">Masks</span>
              </div>
              <div class="pb-mmm">
                <div class="pb-pgrid"></div>
                <div class="pb-mypack">
                  <div class="mp-h">My Pack <span class="mp-b">0/6</span></div>
                  <div class="mp-list"></div>
                  <div class="mp-guide">Add 6 more to fill your box</div>
                  <div class="mp-cart mp-addcart dis"><span>Add to Cart</span><span class="tv">$0.00</span></div>
                </div>
              </div>
            </div>
            <div class="pb-drawer-mask"></div>
            <div class="pb-drawer">
              <div class="pb-drawer-h"><span>Your cart</span><span class="x">✕</span></div>
              <div class="pb-drawer-body"></div>
              <div class="pb-drawer-foot"><div class="row"><span>Subtotal</span><span class="dsub">$0.00</span></div><div class="pb-drawer-checkout">Checkout</div></div>
            </div>
          </div>
          <div class="pb-desc">
            <h3>Mix &amp; Match — Multiple Products</h3>
            <div class="pb-pt"><span class="k">How it works</span><p>Curate the products, set min/max and per-variant limits, and customers build a personalized multi-product bundle.</p></div>
            <div class="pb-pt"><span class="k">Benefits</span><p>Grow basket size with fully customizable multi-product sets — great for curated collections and custom kits — while you keep control over rules and limits.</p></div>
            <div class="pb-pt"><span class="k">Flexibility</span><p>Curate the catalog, set min/max and offer variant options inline — as an embedded widget or a standalone bundle page.</p></div>
            <a href="https://apps.shopify.com/push-bundle" target="_blank" rel="noopener noreferrer" class="pb-btn pb-btn-grad">Experience Mix &amp; Match ↗</a>
          </div>
        </div>
      </div>

      <div class="pb-panel pb-panel-5">
        <div class="pb-panel-grid">
          <div class="pb-pv" id="pbw-byob">
            <div class="pb-pv-bar"><span class="dots"><i></i><i></i><i></i></span><span class="ttl">Build Your Own Box</span></div>
            <div class="pb-pv-body">
              <div class="pb-byob-h">
                <h4>Create Your Own Gift Box</h4>
                <p>Create your very own box in just a few simple steps with a personalised message.</p>
                <span class="pill">⚡ Build your own box and save an additional 10% off</span>
              </div>
              <div class="pb-track">
                <div class="stp on"><div class="cir">1</div><div class="cl">Select Box</div></div>
                <div class="stp"><div class="cir">2</div><div class="cl">Choose Products</div></div>
                <div class="stp"><div class="cir">3</div><div class="cl">Select Card</div></div>
                <div class="stp"><div class="cir">4</div><div class="cl">Form Submission</div></div>
              </div>
              <div class="pb-byob-body"></div>
              <div class="pb-byob-foot"><span class="pb-byob-thumbs"></span><span>Total: <span class="tot"><s class="orig"></s><span class="now">$0.00</span></span> USD</span></div>
              <div class="pb-byob-nav2"><button class="bk" type="button" disabled>Back</button><button class="nx" type="button">Next</button></div>
            </div>
            <div class="pb-drawer-mask"></div>
            <div class="pb-drawer">
              <div class="pb-drawer-h"><span>Your cart</span><span class="x">✕</span></div>
              <div class="pb-drawer-body"></div>
              <div class="pb-drawer-foot"><div class="row"><span>Subtotal</span><span class="dsub">$0.00</span></div><div class="pb-drawer-checkout">Checkout</div></div>
            </div>
          </div>
          <div class="pb-desc">
            <h3>Build Your Own Box</h3>
            <div class="pb-pt"><span class="k">How it works</span><p>Design a guided, multi-step flow — choose a box, add items, and collect custom details before adding to cart.</p></div>
            <div class="pb-pt"><span class="k">Benefits</span><p>Turn gifting into a premium experience that lifts AOV — shoppers assemble a personalized box, add a card, and leave a message, all in one guided flow.</p></div>
            <div class="pb-pt"><span class="k">Flexibility</span><p>Configure each step — boxes, products, cards, and custom form fields — then reorder or drop steps to fit any gifting or subscription flow.</p></div>
            <a href="https://apps.shopify.com/push-bundle" target="_blank" rel="noopener noreferrer" class="pb-btn pb-btn-grad">Experience BYOB Bundle ↗</a>
          </div>
        </div>
      </div>

    </div>
  </section>
`;

export function FeatureShowcaseLive() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = rootRef.current;
    if (!host) return;
    const root = host.querySelector<HTMLElement>(".pb-idemo");
    if (!root || root.dataset.pbInit) return;
    root.dataset.pbInit = "1";

    const money = (n: number) => "$" + n.toFixed(2);
    const IMG: Record<string, string> = {
      serum: "https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-vitamin-c-skincare-serum-in-a-frosted-amber-glass-dropper-bottle-minimalist-white-label-standing-on-a-smooth-marble-surface-soft-natural-studio-lighting-clean-light-beige-ba.png?v=1784800605",
      moist: "https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-daily-glow-face-moisturizer-in-a-white-ceramic-jar-with-a-minimalist-label-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-background-professional-product-photog.png?v=1784802185",
      mask: "https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-revitalizing-face-sheet-mask-in-a-flat-foil-sachet-packet-with-a-minimalist-pastel-green-label-lying-flat-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-backgro.png?v=1784802926",
      hyal: "https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-hyaluronic-acid-hydrating-serum-in-a-frosted-clear-glass-dropper-bottle-with-a-soft-blue-tint-minimalist-white-label-on-a-smooth-marble-surface-soft-studio-lighting-clean-li.png?v=1784800834",
      clean: "https://cdn.shopify.com/s/files/1/0689/7493/6135/files/a-premium-gentle-foaming-facial-cleanser-in-a-white-pump-bottle-minimalist-label-on-a-smooth-marble-surface-soft-studio-lighting-clean-light-background-professional-product-photograph.png?v=1784801818",
    };
    const q = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = root) =>
      ctx.querySelector<T>(sel);
    const qa = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = root) =>
      Array.from(ctx.querySelectorAll<T>(sel));

    const qtyWire = (w: HTMLElement) => {
      qa<HTMLElement>(".pb-qty", w).forEach((box) => {
        const n = box.querySelector<HTMLElement>(".n")!;
        box.querySelectorAll<HTMLButtonElement>("button").forEach((b) => {
          b.addEventListener("click", () => {
            const v = Math.max(1, +n.textContent! + +b.dataset.q!);
            n.textContent = String(v);
          });
        });
      });
    };

    // Slide-in cart drawer: renders the bundle as ONE line item with nested products
    const makeDrawer = (w: HTMLElement) => {
      const mask = w.querySelector<HTMLElement>(".pb-drawer-mask");
      const drawer = w.querySelector<HTMLElement>(".pb-drawer");
      if (!mask || !drawer) return () => {};
      const body = drawer.querySelector<HTMLElement>(".pb-drawer-body")!;
      const sub = drawer.querySelector<HTMLElement>(".dsub")!;
      const close = () => {
        mask.classList.remove("show");
        drawer.classList.remove("show");
      };
      mask.addEventListener("click", close);
      drawer.querySelector(".x")!.addEventListener("click", close);
      return (o: {
        items: { img: string; name: string; variant?: string }[];
        thumb: string;
        title: string;
        id: string;
        price: number;
        subtotal: number;
      }) => {
        const items = o.items
          .map(
            (it) =>
              '<div class="pb-bitem"><img src="' +
              it.img +
              '" alt=""><span class="bi-n">1 × ' +
              it.name +
              (it.variant ? " <small>/ " + it.variant + "</small>" : "") +
              "</span></div>",
          )
          .join("");
        body.innerHTML =
          '<div class="pb-bundle"><div class="pb-bundle-top"><img class="bt-thumb" src="' +
          o.thumb +
          '" alt=""><div class="bt-n">' +
          o.title +
          "<small>BundleId: " +
          o.id +
          '</small></div><span class="bt-p">' +
          money(o.price) +
          '</span></div><span class="pb-bundle-toggle">Hide ' +
          o.items.length +
          ' items ▲</span><div class="pb-bundle-items">' +
          items +
          "</div></div>";
        const tg = body.querySelector<HTMLElement>(".pb-bundle-toggle")!;
        const il = body.querySelector<HTMLElement>(".pb-bundle-items")!;
        let open = true;
        tg.addEventListener("click", () => {
          open = !open;
          il.style.display = open ? "block" : "none";
          tg.textContent = (open ? "Hide " : "Show ") + o.items.length + " items " + (open ? "▲" : "▼");
        });
        sub.textContent = money(o.subtotal);
        mask.classList.add("show");
        drawer.classList.add("show");
      };
    };

    // Tab switch without scrolling to the hidden radio (fixes "jumps to top")
    qa<HTMLLabelElement>(".pb-tab").forEach((lab) => {
      lab.addEventListener("click", (e) => {
        e.preventDefault();
        const r = document.getElementById(lab.getAttribute("for")!) as HTMLInputElement | null;
        if (r) r.checked = true;
      });
    });

    // Entrance attention pulse on the tab bar (once, when it scrolls into view)
    (() => {
      const tabbar = q<HTMLElement>(".pb-tabbar");
      if (!tabbar) return;
      const fire = () => {
        tabbar.classList.remove("cue");
        void tabbar.offsetWidth;
        tabbar.classList.add("cue");
        const checked = q<HTMLInputElement>(".pb-tabs-input:checked");
        if (checked) {
          const lab = tabbar.querySelector<HTMLElement>('label[for="' + checked.id + '"]');
          if (lab) {
            lab.classList.remove("cueglow");
            void lab.offsetWidth;
            lab.classList.add("cueglow");
          }
        }
      };
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (ents) => {
            ents.forEach((e) => {
              if (e.isIntersecting) {
                fire();
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -50% 0px" },
        );
        io.observe(tabbar);
      } else fire();
    })();

    // "Live — try it below" cue in each preview window's title bar (top-right)
    qa<HTMLElement>(".pb-pv-bar").forEach((bar) => {
      const cue = document.createElement("span");
      cue.className = "pb-livecue";
      cue.innerHTML = '<span class="live-dot"></span>Live — try it below';
      bar.appendChild(cue);
    });

    // Ghost-cursor auto-demo on the Volume tab: shows the preview responding
    (() => {
      const pv = q<HTMLElement>("#pbw-vol");
      if (!pv) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
      const body = pv.querySelector<HTMLElement>(".pb-pv-body")!;
      const t2 = pv.querySelector<HTMLElement>('.pb-rt[data-qty="2"]');
      const t4 = pv.querySelector<HTMLElement>('.pb-rt[data-qty="4"]');
      if (!t2 || !t4) return;
      const ghost = document.createElement("div");
      ghost.className = "pb-ghost";
      ghost.innerHTML =
        '<svg viewBox="0 0 24 24" fill="#fff" stroke="#1f2430" stroke-width="1.3" stroke-linejoin="round"><path d="M5 2.5l14 7-6 2-2 6z"/></svg>';
      const ripple = document.createElement("div");
      ripple.className = "pb-ripple";
      const nudge = document.createElement("div");
      nudge.className = "pb-trynudge";
      nudge.innerHTML = "👆 Your turn — click anything";
      pv.appendChild(ghost);
      pv.appendChild(ripple);
      pv.appendChild(nudge);
      const timers: ReturnType<typeof setTimeout>[] = [];
      let done = false;
      const at = (ms: number, fn: () => void) => {
        timers.push(
          setTimeout(() => {
            if (!done) fn();
          }, ms),
        );
      };
      const rel = (el: HTMLElement) => {
        const pr = pv.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left - pr.left + 52, y: r.top - pr.top + r.height / 2 };
      };
      const moveTo = (el: HTMLElement) => {
        const p = rel(el);
        ghost.style.transform = "translate(" + p.x + "px," + p.y + "px)";
        return p;
      };
      const tap = (el: HTMLElement) => {
        const p = rel(el);
        ripple.style.left = p.x + "px";
        ripple.style.top = p.y + "px";
        ripple.classList.remove("go");
        void ripple.offsetWidth;
        ripple.classList.add("go");
        ghost.classList.add("tap");
        ghost.style.transform = "translate(" + p.x + "px," + p.y + "px) scale(.8)";
        setTimeout(() => {
          ghost.classList.remove("tap");
          ghost.style.transform = "translate(" + p.x + "px," + p.y + "px)";
        }, 150);
      };
      const stop = () => {
        if (done) return;
        done = true;
        timers.forEach(clearTimeout);
        ghost.style.opacity = "0";
        nudge.classList.remove("show");
        setTimeout(() => {
          ghost.remove();
          ripple.remove();
        }, 450);
      };
      pv.addEventListener("pointerdown", stop, { once: true });
      const run = () => {
        if (done) return;
        body.scrollTop = 0;
        ghost.style.transform =
          "translate(" + pv.clientWidth * 0.58 + "px," + pv.clientHeight * 0.72 + "px)";
        at(250, () => (ghost.style.opacity = "1"));
        at(600, () => moveTo(t2));
        at(1750, () => tap(t2));
        at(1880, () => t2.click());
        at(2750, () => moveTo(t4));
        at(3900, () => tap(t4));
        at(4030, () => t4.click());
        at(4700, () => (ghost.style.opacity = "0"));
        at(5000, () => nudge.classList.add("show"));
      };
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (ents) => {
            ents.forEach((e) => {
              if (e.isIntersecting && !done) {
                run();
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -40% 0px" },
        );
        io.observe(pv);
      }
    })();

    // Volume: tier select → N variant dropdowns + gift unlocks + add-to-cart toast
    (() => {
      const w = q<HTMLElement>("#pbw-vol");
      if (!w) return;
      qtyWire(w);
      const tiers = qa<HTMLElement>(".pb-rt", w);
      const slots = w.querySelector<HTMLElement>(".pb-vslots");
      const gifts = qa<HTMLElement>(".pb-gift", w);
      const VARIANTS = ["Fragrance-Free", "Citrus Glow", "Rose Petal"];
      const renderSlots = (qty: number) => {
        if (!slots) return;
        slots.innerHTML = "";
        if (!VARIANTS.length) return;
        for (let i = 1; i <= qty; i++) {
          const row = document.createElement("div");
          row.className = "pb-vslot";
          row.innerHTML =
            '<span class="ix">#' +
            i +
            "</span><select>" +
            VARIANTS.map((v) => "<option>" + v + "</option>").join("") +
            "</select>";
          slots.appendChild(row);
        }
      };
      const select = (t: HTMLElement) => {
        tiers.forEach((x) => x.classList.remove("sel"));
        t.classList.add("sel");
        const qty = +t.dataset.qty!;
        renderSlots(qty);
        if (slots) t.parentNode!.insertBefore(slots, t.nextSibling);
        gifts.forEach((g) => g.classList.toggle("unlocked", qty >= +g.dataset.unlock!));
      };
      tiers.forEach((t) => t.addEventListener("click", () => select(t)));
      gifts.forEach((g) =>
        g.addEventListener("click", () => {
          const need = +g.dataset.unlock!;
          const t = tiers.filter((x) => +x.dataset.qty! === need)[0];
          if (t) select(t);
        }),
      );
      const toast = w.querySelector<HTMLElement>(".pb-toast");
      let tt: ReturnType<typeof setTimeout>;
      qa<HTMLElement>("[data-cart]", w).forEach((btn) =>
        btn.addEventListener("click", () => {
          if (!toast) return;
          toast.classList.add("show");
          clearTimeout(tt);
          tt = setTimeout(() => toast.classList.remove("show"), 1900);
        }),
      );
      select((w.querySelector<HTMLElement>(".pb-rt.sel") || tiers[0])!);
    })();

    // Cross-Sell: toggle companions, 10% off total
    (() => {
      const w = q<HTMLElement>("#pbw-cross");
      if (!w) return;
      qtyWire(w);
      const cards = qa<HTMLElement>(".pb-csc", w);
      const origEl = w.querySelector<HTMLElement>(".orig")!;
      const nowEl = w.querySelector<HTMLElement>(".now")!;
      const cst = w.querySelector<HTMLElement>(".cst");
      const render = () => {
        let sum = 0,
          n = 0;
        cards.forEach((r) => {
          if (r.classList.contains("on")) {
            sum += +r.dataset.price!;
            n++;
          }
        });
        if (cst) cst.textContent = "Total (" + n + " item" + (n === 1 ? "" : "s") + ")";
        origEl.textContent = money(sum);
        nowEl.textContent = " " + money(sum * 0.9);
      };
      cards.forEach((r) =>
        r.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).closest("select")) return;
          r.classList.toggle("on");
          render();
        }),
      );
      qa<HTMLElement>("select", w).forEach((s) =>
        s.addEventListener("click", (e) => e.stopPropagation()),
      );
      const toast = w.querySelector<HTMLElement>(".pb-toast");
      let tt: ReturnType<typeof setTimeout>;
      qa<HTMLElement>("[data-cart]", w).forEach((btn) =>
        btn.addEventListener("click", () => {
          if (!toast) return;
          toast.classList.add("show");
          clearTimeout(tt);
          tt = setTimeout(() => toast.classList.remove("show"), 1900);
        }),
      );
      render();
    })();

    // Mix & Match Single: pack + product grid; sticky cart panel; guide text on the button
    (() => {
      const w = q<HTMLElement>("#pbw-mms");
      if (!w) return;
      qtyWire(w);
      const packs = qa<HTMLElement>(".pb-pack", w);
      const slotsWrap = w.querySelector<HTMLElement>(".pb-slots")!;
      const grid = w.querySelector<HTMLElement>(".pb-mmg")!;
      const cntEl = w.querySelector<HTMLElement>(".cnt")!;
      const btn = w.querySelector<HTMLElement>(".cartbtn")!;
      const UNIT = 8;
      const PRODUCTS = [
        { n: "Hydrating Mask", img: IMG.mask },
        { n: "Brightening Mask", img: IMG.mask },
        { n: "Calming Mask", img: IMG.mask },
        { n: "Detox Mask", img: IMG.mask },
        { n: "Soothing Mask", img: IMG.mask },
      ];
      let size = 3,
        disc = 0.1;
      const filled: { n: string; img: string }[] = [];
      const per = () => UNIT * (1 - disc);
      const renderGrid = () => {
        grid.innerHTML = "";
        const p = per(),
          full = filled.length >= size,
          off = Math.round(disc * 100);
        PRODUCTS.forEach((pr) => {
          const c = document.createElement("div");
          c.className = "pb-mmcard";
          c.innerHTML =
            '<img src="' +
            pr.img +
            '" alt=""><div class="n">' +
            pr.n +
            '</div><div class="p"><span class="op">$' +
            UNIT.toFixed(2) +
            "</span>$" +
            p.toFixed(2) +
            '<span class="off">' +
            off +
            '% off</span></div><div class="stock">In stock</div><button type="button" class="pb-addbtn' +
            (full ? " dis" : "") +
            '">Add to bundle</button>';
          c.querySelector(".pb-addbtn")!.addEventListener("click", () => {
            if (filled.length < size) {
              filled.push(pr);
              render();
            }
          });
          grid.appendChild(c);
        });
      };
      const buildSlots = () => {
        slotsWrap.innerHTML = "";
        for (let i = 0; i < size; i++) {
          const s = document.createElement("div");
          s.className = "pb-slot" + (filled[i] ? " on" : "");
          s.innerHTML = filled[i] ? '<img src="' + filled[i].img + '" alt="">' : "＋";
          ((idx: number) => {
            s.addEventListener("click", () => {
              if (filled[idx]) {
                filled.splice(idx, 1);
                render();
              }
            });
          })(i);
          slotsWrap.appendChild(s);
        }
      };
      const render = () => {
        buildSlots();
        const c = filled.length;
        cntEl.textContent = c + "/" + size;
        if (c < size) {
          btn.classList.add("muted");
          btn.innerHTML = "Add " + (size - c) + " more";
        } else {
          btn.classList.remove("muted");
          btn.innerHTML = "<span>Add to Cart</span><span>" + money(c * per()) + "</span>";
        }
        renderGrid();
      };
      packs.forEach((p) =>
        p.addEventListener("click", () => {
          packs.forEach((x) => x.classList.remove("sel"));
          p.classList.add("sel");
          size = +p.dataset.size!;
          disc = parseFloat(p.dataset.disc!);
          if (filled.length > size) filled.length = size;
          render();
        }),
      );
      const openCart = makeDrawer(w);
      btn.addEventListener("click", () => {
        if (filled.length < size) return;
        const s = filled.length * per();
        openCart({
          title: "Build Your Mask Pack",
          id: "MIX-" + size + "PK",
          thumb: IMG.mask,
          price: s,
          subtotal: s,
          items: filled.map((f) => ({ img: f.img, name: f.n })),
        });
      });
      render();
    })();

    // Mix & Match Multi: box tier + category + product steppers
    (() => {
      const w = q<HTMLElement>("#pbw-mmm");
      if (!w) return;
      const CATS: Record<string, { n: string; p: number; i: string }[]> = {
        skin: [
          { n: "Daily Glow Moisturizer", p: 22, i: IMG.moist },
          { n: "Gentle Cleanser", p: 18, i: IMG.clean },
          { n: "Vitamin C Serum", p: 24, i: IMG.serum },
          { n: "Revitalizing Mask", p: 8, i: IMG.mask },
        ],
        serum: [
          { n: "Vitamin C Serum", p: 24, i: IMG.serum },
          { n: "Hyaluronic Serum", p: 24, i: IMG.hyal },
        ],
        mask: [
          { n: "Revitalizing Mask", p: 8, i: IMG.mask },
          { n: "Detox Clay Mask", p: 12, i: IMG.mask },
        ],
      };
      const grid = w.querySelector<HTMLElement>(".pb-pgrid")!;
      const badge = w.querySelector<HTMLElement>(".mp-b")!;
      const guide = w.querySelector<HTMLElement>(".mp-guide")!;
      const list = w.querySelector<HTMLElement>(".mp-list")!;
      const tv = w.querySelector<HTMLElement>(".mp-cart .tv")!;
      const addBtn = w.querySelector<HTMLElement>(".mp-addcart")!;
      const boxts = qa<HTMLElement>(".pb-boxt", w);
      const cats = qa<HTMLElement>(".pb-cat", w);
      let size = 6,
        disc = 0.1;
      const pack: Record<string, { n: string; p: number; q: number; img: string }> = {};
      const count = () => Object.keys(pack).reduce((c, k) => c + pack[k].q, 0);
      const sum = () => Object.keys(pack).reduce((s, k) => s + pack[k].q * pack[k].p, 0);
      const renderPack = () => {
        const c = count();
        badge.textContent = c + "/" + size;
        const keys = Object.keys(pack).filter((k) => pack[k].q > 0);
        list.innerHTML = keys
          .map(
            (k) =>
              '<div class="mp-item"><span class="l"><img src="' +
              pack[k].img +
              '" alt=""><span>' +
              pack[k].n +
              " × " +
              pack[k].q +
              "</span></span><span>" +
              money(pack[k].q * pack[k].p) +
              "</span></div>",
          )
          .join("");
        const rem = size - c;
        if (rem > 0) {
          guide.style.display = "block";
          guide.textContent = "You need to add " + rem + " more to fill your box";
        } else guide.style.display = "none";
        const s = sum();
        tv.innerHTML =
          c > 0 && disc > 0
            ? '<s style="color:#9aa0ac;font-weight:400;font-size:12px;margin-right:5px;">' +
              money(s) +
              "</s>" +
              money(s * (1 - disc))
            : money(s);
        if (addBtn) addBtn.classList.toggle("dis", c < 1);
      };
      const renderGrid = (cat: string) => {
        grid.innerHTML = "";
        CATS[cat].forEach((pr) => {
          const key = pr.n;
          if (!pack[key]) pack[key] = { n: pr.n, p: pr.p, q: 0, img: pr.i };
          const card = document.createElement("div");
          card.className = "pb-pcard";
          card.innerHTML =
            '<div class="pc-img"><img src="' +
            pr.i +
            '" alt=""></div><div class="pc-n">' +
            pr.n +
            '</div><div class="pc-p">' +
            money(pr.p) +
            '</div><div class="pb-qty"><button type="button" class="mn">−</button><span class="n">' +
            pack[key].q +
            '</span><button type="button" class="pl">+</button></div>';
          card.querySelector(".pl")!.addEventListener("click", () => {
            if (count() < size) {
              pack[key].q++;
              card.querySelector<HTMLElement>(".n")!.textContent = String(pack[key].q);
              renderPack();
            }
          });
          card.querySelector(".mn")!.addEventListener("click", () => {
            if (pack[key].q > 0) {
              pack[key].q--;
              card.querySelector<HTMLElement>(".n")!.textContent = String(pack[key].q);
              renderPack();
            }
          });
          grid.appendChild(card);
        });
      };
      boxts.forEach((b) =>
        b.addEventListener("click", () => {
          boxts.forEach((x) => x.classList.remove("sel"));
          b.classList.add("sel");
          size = +b.dataset.size!;
          disc = parseFloat(b.dataset.disc!);
          renderPack();
        }),
      );
      cats.forEach((c) =>
        c.addEventListener("click", () => {
          cats.forEach((x) => x.classList.remove("on"));
          c.classList.add("on");
          renderGrid(c.dataset.cat!);
        }),
      );
      const openCart = makeDrawer(w);
      addBtn.addEventListener("click", () => {
        if (addBtn.classList.contains("dis")) return;
        const items: { img: string; name: string }[] = [];
        for (const k in pack) for (let i = 0; i < pack[k].q; i++) items.push({ img: pack[k].img, name: pack[k].n });
        const s = sum();
        openCart({
          title: "Mix & Match Box",
          id: "MIX-" + size + "BOX",
          thumb: items[0] ? items[0].img : IMG.serum,
          price: s * (1 - disc),
          subtotal: s * (1 - disc),
          items,
        });
      });
      renderGrid("skin");
      renderPack();
    })();

    // BYOB: 4-step guided flow (box → products 2–6 → card → gift form → cart drawer)
    (() => {
      const w = q<HTMLElement>("#pbw-byob");
      if (!w) return;
      const body = w.querySelector<HTMLElement>(".pb-byob-body")!;
      const track = qa<HTMLElement>(".pb-track .stp", w);
      const thumbsEl = w.querySelector<HTMLElement>(".pb-byob-thumbs")!;
      const origEl = w.querySelector<HTMLElement>(".pb-byob-foot .orig")!;
      const nowEl = w.querySelector<HTMLElement>(".pb-byob-foot .now")!;
      const bk = w.querySelector<HTMLButtonElement>(".bk")!;
      const nx = w.querySelector<HTMLButtonElement>(".nx")!;
      const openCart = makeDrawer(w);
      let idx = 0;
      const st: {
        box: { n: string; p: number; i: string } | null;
        products: Record<string, { n: string; p: number; i: string; q: number }>;
        card: { n: string; p: number } | null;
      } = { box: null, products: {}, card: null };
      const BOXES = [
        { n: "Kraft Gift Box", p: 6, i: IMG.clean },
        { n: "Signature Navy Box", p: 10, i: IMG.moist },
      ];
      const PRODUCTS = [
        { n: "Scented Candle", p: 22, i: IMG.moist },
        { n: "Sheet Mask Set", p: 16, i: IMG.mask },
        { n: "Vitamin C Serum", p: 24, i: IMG.serum },
        { n: "Gentle Cleanser", p: 18, i: IMG.clean },
        { n: "Hydrating Serum", p: 15, i: IMG.hyal },
        { n: "Daily Moisturizer", p: 10, i: IMG.moist },
      ];
      const CARDS = [
        { n: "Thank You Card", p: 5 },
        { n: "Birthday Card", p: 5 },
        { n: "No card", p: 0 },
      ];
      const prodCount = () => Object.keys(st.products).reduce((c, k) => c + st.products[k].q, 0);
      const subtotal = () => {
        let s = 0;
        if (st.box) s += st.box.p;
        for (const k in st.products) s += st.products[k].q * st.products[k].p;
        if (st.card) s += st.card.p;
        return s;
      };
      const selItems = () => {
        const a: { n: string; p: number; i: string; q: number }[] = [];
        for (const k in st.products) for (let i = 0; i < st.products[k].q; i++) a.push(st.products[k]);
        return a;
      };
      const renderFoot = () => {
        const items = selItems();
        thumbsEl.innerHTML = items.length
          ? items
              .map(
                (it) =>
                  '<span class="pb-byob-thumb" data-k="' +
                  it.n +
                  '"><img src="' +
                  it.i +
                  '" alt=""><span class="rm">✕</span></span>',
              )
              .join("")
          : '<span class="pb-byob-empty">Your box is empty</span>';
        qa<HTMLElement>(".pb-byob-thumb", thumbsEl).forEach((el) => {
          el.querySelector(".rm")!.addEventListener("click", (e) => {
            e.stopPropagation();
            const k = el.dataset.k!;
            if (st.products[k]) {
              st.products[k].q--;
              if (st.products[k].q <= 0) delete st.products[k];
            }
            render();
          });
        });
        const s = subtotal();
        if (s > 0) {
          origEl.textContent = money(s);
          nowEl.textContent = " " + money(s * 0.9);
        } else {
          origEl.textContent = "";
          nowEl.textContent = "$0.00";
        }
      };
      const renderTrack = () => {
        track.forEach((t, i) => {
          t.classList.remove("on", "done");
          if (i < idx) t.classList.add("done");
          else if (i === idx) t.classList.add("on");
        });
      };
      const canNext = () => {
        if (idx === 0) return !!st.box;
        if (idx === 1) return prodCount() >= 2;
        if (idx === 2) return !!st.card;
        return true;
      };
      const render = () => {
        renderTrack();
        body.innerHTML = "";
        if (idx === 0) {
          let h = '<div class="pb-byob-sub2"><span>Choose your gift box</span></div><div class="pb-boxpick">';
          BOXES.forEach((b, i) => {
            h +=
              '<div class="pb-boxopt' +
              (st.box && st.box.n === b.n ? " sel" : "") +
              '" data-i="' +
              i +
              '"><div class="bi"><img src="' +
              b.i +
              '" alt=""></div><div class="bn">' +
              b.n +
              " · " +
              money(b.p) +
              "</div></div>";
          });
          h += "</div>";
          body.innerHTML = h;
          body.querySelectorAll<HTMLElement>(".pb-boxopt").forEach((el) => {
            el.addEventListener("click", () => {
              st.box = BOXES[+el.dataset.i!];
              render();
            });
          });
        } else if (idx === 1) {
          let h2 =
            '<div class="pb-byob-sub2"><span>Choose products</span><span class="sel-c">Select 2–6 · ' +
            prodCount() +
            ' selected</span></div><div class="pb-bpgrid">';
          PRODUCTS.forEach((p, i) => {
            const key = p.n;
            const qn = st.products[key] ? st.products[key].q : 0;
            h2 +=
              '<div class="pb-bpcard' +
              (qn > 0 ? " on" : "") +
              '" data-i="' +
              i +
              '"><img src="' +
              p.i +
              '" alt=""><div class="n">' +
              p.n +
              '</div><div class="p">' +
              money(p.p) +
              "</div>" +
              (qn > 0
                ? '<div class="pb-qty"><button type="button" class="mn">−</button><span class="n">' +
                  qn +
                  '</span><button type="button" class="pl">+</button></div>'
                : '<button type="button" class="pb-addbtn">Add to bundle</button>') +
              "</div>";
          });
          h2 += "</div>";
          body.innerHTML = h2;
          body.querySelectorAll<HTMLElement>(".pb-bpcard").forEach((card) => {
            const p = PRODUCTS[+card.dataset.i!];
            const key = p.n;
            const add = card.querySelector<HTMLElement>(".pb-addbtn");
            if (add) add.addEventListener("click", () => { st.products[key] = { n: p.n, p: p.p, i: p.i, q: 1 }; render(); });
            const pl = card.querySelector<HTMLElement>(".pl");
            if (pl) pl.addEventListener("click", () => { st.products[key].q++; render(); });
            const mn = card.querySelector<HTMLElement>(".mn");
            if (mn) mn.addEventListener("click", () => { st.products[key].q--; if (st.products[key].q <= 0) delete st.products[key]; render(); });
          });
        } else if (idx === 2) {
          let h3 = '<div class="pb-byob-sub2"><span>Select a greeting card</span></div>';
          CARDS.forEach((c, i) => {
            h3 +=
              '<div class="pb-opt' +
              (st.card && st.card.n === c.n ? " sel" : "") +
              '" data-i="' +
              i +
              '"><span>' +
              c.n +
              '</span><span class="pr">' +
              (c.p ? "+ " + money(c.p) : "Free") +
              "</span></div>";
          });
          body.innerHTML = h3;
          body.querySelectorAll<HTMLElement>(".pb-opt").forEach((el) => {
            el.addEventListener("click", () => { st.card = CARDS[+el.dataset.i!]; render(); });
          });
        } else {
          body.innerHTML =
            '<div class="pb-byob-sub2"><span>Gift details</span></div><div class="pb-bform"><label>Sender *</label><input placeholder="Your sender…"><label>Recipient *</label><input placeholder="Your recipient…"><label>Recipient email *</label><input placeholder="Your recipient email…"><label>Message *</label><textarea placeholder="Your message…"></textarea></div>';
        }
        bk.disabled = idx === 0;
        nx.textContent = idx === 3 ? "Finish — Add to cart" : "Next";
        nx.disabled = !canNext();
        renderFoot();
      };
      bk.addEventListener("click", () => {
        if (idx > 0) {
          idx--;
          render();
        }
      });
      nx.addEventListener("click", () => {
        if (!canNext()) return;
        if (idx < 3) {
          idx++;
          render();
          return;
        }
        const items = selItems().map((it) => ({ img: it.i, name: it.n }));
        if (st.box) items.unshift({ img: st.box.i, name: st.box.n });
        const s = subtotal();
        openCart({
          title: "Build Your Own Box",
          id: "BYOB-1537",
          thumb: st.box ? st.box.i : IMG.moist,
          price: s * 0.9,
          subtotal: s * 0.9,
          items,
        });
      });
      render();
    })();
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        ref={rootRef}
        className="pb-home"
        dangerouslySetInnerHTML={{ __html: HTML }}
      />
    </>
  );
}
