(()=>{
 const root=document.documentElement,storageKey='racesplit-appearance-v1';
 let settings={design:'refresh',theme:'auto',raceMode:false};
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved){settings.theme=['auto','light','dark'].includes(saved.theme)?saved.theme:'auto';settings.raceMode=saved.raceMode===true;}}catch{}
 const apply=()=>{root.dataset.design=settings.design;root.dataset.theme=settings.theme;root.dataset.raceMode=settings.design==='refresh'&&settings.raceMode?'on':'off';};apply();
 const init=()=>{
 const theme=document.getElementById('themeChoice'),race=document.getElementById('raceMode');
 if(!theme||!race)return;
 const buttons=[...theme.querySelectorAll("button[data-theme]")];
 const update=()=>{apply();theme.dataset.selected=settings.theme;for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.theme===settings.theme));race.setAttribute('aria-pressed',String(settings.raceMode));race.textContent=settings.raceMode?'Standard view':'Race view';race.setAttribute('aria-label',settings.raceMode?'Switch to standard timer view':'Switch to high-visibility race view');document.getElementById('appearanceStatus').textContent=settings.raceMode?'Race view · high visibility':settings.theme==='auto'?'Appearance follows your device':settings.theme+' appearance';document.getElementById('favicon').href='/brand/rs.svg';const meta=document.querySelector('meta[name=theme-color]');meta.content=settings.raceMode?'#000000':settings.theme==='dark'||(settings.theme==='auto'&&window.matchMedia?.('(prefers-color-scheme: dark)').matches)?'#101722':'#F7F8FA';try{localStorage.setItem(storageKey,JSON.stringify(settings));}catch{}};
 for(const button of buttons)button.onclick=()=>{settings.theme=button.dataset.theme;update();};race.onclick=()=>{settings.raceMode=!settings.raceMode;update();};window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',update);update();
 };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
