// OTG! v6.0.141 — SPECIALS persistence unchanged; active-screen scroll boundary repair
state=rhLoad();
rhSync();
if(state&&!state.onboarded){window.rhStartOnboardingIfNeeded?.();}else{show('home');}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker-v6141.js',{updateViaCache:'none'}).catch(()=>{}));}

// Preserve OTG!'s native document/page scrolling. Only stop the browser from travelling
// above/below the currently visible .screen. Hidden screens and document padding must not
// enlarge the usable scroll range. Nested lists keep their own normal scrolling.
(()=>{
  let correcting=false,lastY=null;
  const activeScreen=()=>document.querySelector('main > .screen:not(.hidden)');
  const viewportH=()=>window.visualViewport?.height||window.innerHeight||document.documentElement.clientHeight;
  const limits=()=>{
    const s=activeScreen();
    if(!s)return {min:0,max:Math.max(0,document.documentElement.scrollHeight-viewportH())};
    const r=s.getBoundingClientRect();
    const top=window.scrollY+r.top;
    const bottom=window.scrollY+r.bottom;
    return {min:Math.max(0,top),max:Math.max(Math.max(0,top),bottom-viewportH())};
  };
  const clamp=()=>{
    if(correcting)return;
    const {min,max}=limits(), y=window.scrollY;
    const target=y<min-1?min:(y>max+1?max:null);
    if(target!==null){
      correcting=true;
      window.scrollTo(0,target);
      requestAnimationFrame(()=>{correcting=false});
    }
  };
  const nestedScrollable=(node)=>{
    let el=node instanceof Element?node:null;
    while(el&&el!==document.body&&el!==document.documentElement){
      const cs=getComputedStyle(el);
      if(/(auto|scroll)/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+1)return el;
      el=el.parentElement;
    }
    return null;
  };
  window.addEventListener('scroll',clamp,{passive:true});
  window.visualViewport?.addEventListener('resize',clamp,{passive:true});
  document.addEventListener('touchstart',e=>{lastY=e.touches?.[0]?.clientY??null},{capture:true,passive:true});
  document.addEventListener('touchmove',e=>{
    if(lastY==null||!e.touches?.length)return;
    const y=e.touches[0].clientY,dy=y-lastY; lastY=y;
    if(nestedScrollable(e.target))return;
    const {min,max}=limits(),sy=window.scrollY;
    if((sy<=min+1&&dy>0)||(sy>=max-1&&dy<0))e.preventDefault();
  },{capture:true,passive:false});
  const end=()=>{lastY=null;clamp()};
  document.addEventListener('touchend',end,{capture:true,passive:true});
  document.addEventListener('touchcancel',end,{capture:true,passive:true});
  window.addEventListener('load',()=>requestAnimationFrame(clamp),{once:true});
})();
