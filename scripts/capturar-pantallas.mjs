/** Capturas reales actuales en las proporciones de notebook, celular y tablet del landing. */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const base=process.env.APP_URL||'http://localhost:3000';
if(!process.env.APP_USER || !process.env.APP_PASS) throw Error('Faltan APP_USER y APP_PASS');
const destino=join(process.cwd(),'public/screens');await mkdir(destino,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
function privacy(){
 const start=()=>{
  const style=document.createElement('style');style.textContent='nextjs-portal,.ai-orb-position{display:none!important}html{scrollbar-width:none}::-webkit-scrollbar{display:none!important}.demo-private{filter:blur(8px)}';document.head.appendChild(style);
  const clean=()=>{for(const element of document.querySelectorAll('span.gm-mono.text-center,span.gm-mono.whitespace-nowrap')){const text=element.textContent?.trim()||'';if(text && !/^ZZ\d{3}Z[XV]$/.test(text))element.classList.add('demo-private')}};
  let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;clean()},80)}).observe(document.body,{childList:true,subtree:true});clean();
 };
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
}
async function login(page){
 await page.goto(base+'/auth/login',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{const form=document.querySelector('form');return form&&Object.keys(form).some(key=>key.startsWith('__reactProps')&&typeof form[key]?.onSubmit==='function')});
 await page.locator('input[name=identifier]').fill(process.env.APP_USER);await page.locator('input[name=password]').fill(process.env.APP_PASS);
 await page.locator('form button[type=submit]').click();await page.waitForURL(url=>url.pathname==='/tickets');
}
async function screen(page,name,route,heading){
 if(route)await page.goto(base+route,{waitUntil:'domcontentloaded'});
 if(heading)await page.getByRole('heading',{name:heading}).first().waitFor({timeout:60000});
 await page.waitForTimeout(2500);await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0)});await page.waitForTimeout(400);
 if(name==='tarifas-desktop'){await page.getByRole('heading',{name:'Lista de precios por duración',exact:true}).evaluate(element=>{element.scrollIntoView({block:'start'});window.scrollBy(0,-24)});await page.waitForTimeout(500)}
 await page.screenshot({path:join(destino,name+'.png')});console.log('CAPTURA',name);
}
try{
 const desktop=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,serviceWorkers:'block'});await desktop.addInitScript(privacy);const page=await desktop.newPage();await login(page);const state=await desktop.storageState();
 await screen(page,'operacion-desktop','/tickets',/Entradas y salidas/);
 await screen(page,'tarifas-desktop','/admin/tarifas',/Lista de precios por duración/);await desktop.close();
 const phone=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:3,storageState:state,serviceWorkers:'block'});await phone.addInitScript(privacy);const mobile=await phone.newPage();
 await screen(mobile,'operacion-mobile','/tickets',/Entradas y salidas/);
 await mobile.getByRole('button',{name:'Ver todos',exact:true}).click();await screen(mobile,'activos-mobile',null,/En la playa/);await phone.close();
 const tablet=await browser.newContext({viewport:{width:1180,height:820},deviceScaleFactor:2,storageState:state,serviceWorkers:'block'});await tablet.addInitScript(privacy);const panel=await tablet.newPage();
 await panel.goto(base+'/admin/caja?tab=turnos',{waitUntil:'domcontentloaded'});await panel.getByRole('heading',{name:'Cajas y turnos abiertos',exact:true}).waitFor();await panel.getByText('Cargando cajas…',{exact:true}).waitFor({state:'hidden',timeout:60000});
 await panel.locator('#historial').scrollIntoViewIfNeeded();await panel.locator('[data-tour=caja-tabla] details').first().waitFor({timeout:60000});await panel.locator('[data-tour=caja-tabla] details').first().locator('summary').click();await panel.getByRole('heading',{name:'Historial de turnos',exact:true}).evaluate(element=>{element.scrollIntoView({block:'start'});window.scrollBy(0,-24)});await panel.waitForTimeout(700);await panel.screenshot({path:join(destino,'turnos-tablet.png')});console.log('CAPTURA turnos-tablet');await tablet.close();
}finally{await browser.close()}
