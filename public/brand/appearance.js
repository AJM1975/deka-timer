(()=>{
 const root=document.documentElement,storageKey='racesplit-appearance-v1';
 let settings={design:'refresh',theme:'auto',raceMode:false};
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved){settings.design=['refresh','current'].includes(saved.design)?saved.design:'refresh';settings.theme=['auto','light','dark'].includes(saved.theme)?saved.theme:'auto';settings.raceMode=saved.raceMode===true;}}catch{}
 const apply=()=>{root.dataset.design=settings.design;root.dataset.theme=settings.theme;root.dataset.raceMode=settings.design==='refresh'&&settings.raceMode?'on':'off';};apply();
 const init=()=>{
 const design=document.getElementById('designChoice'),theme=document.getElementById('themeChoice'),race=document.getElementById('raceMode');
 if(!design||!theme||!race)return;
 const buttons=[...theme.querySelectorAll("button[data-theme]")];
 const update=()=>{apply();design.value=settings.design;theme.dataset.selected=settings.theme;for(const button of buttons){button.disabled=settings.design==='current';button.setAttribute('aria-pressed',String(button.dataset.theme===settings.theme));}race.disabled=settings.design==='current';race.setAttribute('aria-pressed',String(settings.design==='refresh'&&settings.raceMode));race.textContent=settings.design==='refresh'&&settings.raceMode?'Exit Race Mode':'Enter Race Mode';document.getElementById('appearanceStatus').textContent=settings.design==='current'?'Current design restored. Your races and account are unchanged.':settings.raceMode?'Race Mode · high visibility':'Brand preview · '+(settings.theme==='auto'?'follows device appearance':settings.theme+' mode');document.getElementById('favicon').href=settings.design==='refresh'?'/brand/rs.svg':'/icon.svg';const meta=document.querySelector('meta[name=theme-color]');meta.content=settings.design==='current'?'#0c1320':settings.raceMode?'#000000':settings.theme==='dark'||(settings.theme==='auto'&&window.matchMedia?.('(prefers-color-scheme: dark)').matches)?'#101722':'#F7F8FA';try{localStorage.setItem(storageKey,JSON.stringify(settings));}catch{}};
 design.onchange=()=>{settings.design=design.value;update();};for(const button of buttons)button.onclick=()=>{settings.theme=button.dataset.theme;update();};race.onclick=()=>{settings.raceMode=!settings.raceMode;update();};window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',update);update();
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
