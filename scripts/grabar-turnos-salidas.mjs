/** Tutorial de turnos y salidas: producción de prueba, dos dispositivos, sin credenciales en disco. */
import { chromium, devices } from 'playwright';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
const root=process.cwd(),base=process.env.DEMO_BASE_URL,chapter='cobro';
if(!base || !process.env.ADMIN_USER || !process.env.ADMIN_PASS) throw Error('Faltan DEMO_BASE_URL, ADMIN_USER o ADMIN_PASS');
const part=process.argv[2]||'configuracion';
const out=join(root,'.revision','dos-dispositivos','cobro-20261012-'+part);
await mkdir(out,{recursive:true});
const metadata=new Map(),ds=[];
const browser=await chromium.launch({channel:'chrome'});
const recording={chapter,part,base,devices:{},scenes:[],startedAt:Date.now()};
async function authenticate(role) {
 const ctx=await browser.newContext({serviceWorkers:'block'}), p=await ctx.newPage();
 await p.goto(base+'/auth/login',{waitUntil:'domcontentloaded',timeout:90000});
 await p.waitForFunction(()=>{const f=document.querySelector('form');return f&&Object.keys(f).some(k=>k.startsWith('__reactProps')&&typeof f[k]?.onSubmit==='function')},null,{timeout:90000});
 await p.locator('input[name=identifier]').fill(process.env[role+'_USER']); await p.locator('input[name=password]').fill(process.env[role+'_PASS']);
 await p.locator('form button[type=submit]').click(); await p.waitForURL(u=>u.pathname==='/tickets',{waitUntil:'domcontentloaded',timeout:90000});
 const s=await ctx.storageState();await ctx.close();return s;
}
function installDemoSkin({mobile}) {
 const start=()=>{
  if(!document.head)return;
  const st=document.createElement('style');st.textContent=`nextjs-portal,.ai-orb-position{display:none!important}.demo-private{filter:blur(9px)!important}#demo-caption{position:fixed;left:${mobile?'12':'26'}px;bottom:${mobile?'108':'22'}px;z-index:2147483646;pointer-events:none;width:${mobile?'366':'480'}px;max-width:calc(100vw - ${mobile?'24':'52'}px);padding:${mobile?'9px 12px':'18px 22px'};border:1px solid #f5c518aa;border-radius:14px;background:#0d0c0bf5;color:white;font-family:Arial,sans-serif;box-shadow:0 10px 30px #0006}#demo-caption small{display:block;color:#f5c518;font-size:${mobile?'9':'12'}px;font-weight:800;margin-bottom:4px}#demo-caption strong{display:block;font-size:${mobile?'16':'25'}px;line-height:1.15}#demo-caption p{display:${mobile?'none':'block'};font-size:${mobile?'11':'16'}px;line-height:1.35;margin:5px 0 0;color:#ddd8c9}.demo-focus{outline:3px solid #f5c518!important;outline-offset:3px!important}#demo-tap{position:fixed;pointer-events:none;z-index:2147483647;width:52px;height:52px;border-radius:50%;border:3px solid white;background:#ffffff30;box-shadow:0 0 0 9px #ffffff12;transform:translate(-50%,-50%);transition:opacity .45s}#demo-cursor{position:fixed;pointer-events:none;z-index:2147483647;width:26px;height:26px;background:#f5c51833;border:2px solid #f5c518;border-radius:50%;transform:translate(-50%,-50%)}`;document.head.appendChild(st);
  const clean=()=>{
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
   while(n=walker.nextNode()) {if(n.parentElement?.closest('script,style,#demo-caption,input,textarea'))continue;const s=n.textContent;let t=s.replace(/Alvaro Garcia/g,'Administrador demo').replace(/Graciela Bertolo/g,'Equipo demo').replace(/Buenas (tardes|días|noches), Andres/g,'Buenas $1, operador').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'usuario@demo.local'); if(t!==s)n.parentElement?.classList.add("demo-private");}
   for(const n of document.querySelectorAll('span.gm-mono.text-center,span.gm-mono.whitespace-nowrap')) { const v=n.textContent?.trim()||''; if(v&&!/^ZZ\d{3}Z[XV]$/.test(v))n.classList.add('demo-private'); }
   if(location.pathname==='/admin/users') document.querySelectorAll('tbody td:nth-child(1),tbody td:nth-child(2)').forEach(n=>n.classList.add('demo-private'));
   if(location.pathname==='/admin/frecuentes') document.querySelectorAll('tbody td:nth-child(1),tbody td:nth-child(2),tbody td:nth-child(3)').forEach(n=>n.classList.add('demo-private'));
   if(location.pathname==='/notes')document.querySelectorAll('tbody, [data-note-card]').forEach(n=>n.classList.add('demo-private'));
  };
  let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;clean()},50)}).observe(document.body,{childList:true,subtree:true,characterData:true});clean();
  if(!mobile)document.addEventListener('pointermove',e=>{let c=document.getElementById('demo-cursor');if(!c){c=document.createElement('div');c.id='demo-cursor';document.body.appendChild(c)}c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';});
 }; document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
}
const all=fn=>Promise.all(ds.map(fn));
async function go(d,route){await d.page.goto(base+route,{waitUntil:'domcontentloaded',timeout:90000});await d.page.waitForFunction(()=>[...document.querySelectorAll('input,button')].some(n=>Object.keys(n).some(k=>k.startsWith('__reactProps') && (typeof n[k]?.onChange==='function'||typeof n[k]?.onClick==='function'))),null,{timeout:90000});await d.page.waitForTimeout(2400)}
async function tap(d,loc){loc=loc.first();await loc.waitFor({state:'visible',timeout:45000});for(let attempt=0;attempt<3;attempt++){try{await loc.scrollIntoViewIfNeeded();break}catch(e){if(attempt===2)throw e;await d.page.waitForTimeout(600)}}const b=await loc.boundingBox();if(b){if(!d.mobile)await d.page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});await d.page.evaluate(({x,y})=>{let p=document.getElementById('demo-tap');if(!p){p=document.createElement('div');p.id='demo-tap';document.body.appendChild(p)}p.style.left=x+'px';p.style.top=y+'px';p.style.opacity='1';setTimeout(()=>p.style.opacity='0',650)},{x:b.x+b.width/2,y:b.y+b.height/2});}await d.page.waitForTimeout(180);await(d.mobile?loc.tap():loc.click());await d.page.waitForTimeout(500)}
async function closeDialog(d){const dialog=d.page.getByRole('dialog').last();const close=dialog.getByRole('button',{name:/^(Listo|Cerrar|Cancelar)$/i});if(await close.count())await tap(d,close.last());else await d.page.keyboard.press('Escape');await d.page.waitForTimeout(500)}
async function menu(d,route){const p=d.page;await p.evaluate(()=>window.scrollTo({top:0,behavior:'smooth'}));await p.waitForTimeout(700);await tap(d,p.getByRole('button',{name:/Tu cuenta y el menú|Alvaro Garcia|Andres Gaute/}).first());const m=p.getByRole('menu');await m.waitFor({timeout:60000});let link=m.locator(`a[href="${route}"]:visible`).first();if(!await link.isVisible().catch(()=>false)){const branch=m.getByRole('menuitem',{name:route.startsWith('/admin')?/Administración/i:/Operación/i}).first();await tap(d,branch)}await link.waitFor();return link}
async function hideMenu(d){await d.page.keyboard.press('Escape');await d.page.waitForTimeout(300)}
async function scene(n,target=null,options={}) {
 const meta={...metadata.get(n),...options};if(!meta.text)throw Error('Escena sin texto '+n);
 await all(async d=>{if(target){const loc=target(d);if(loc&&await loc.count()){await loc.first().scrollIntoViewIfNeeded().catch(()=>{});if(process.env.DEMO_CENTER_SCENE==='1'){await loc.first().evaluate(el=>(el.closest('fieldset,section')||el).scrollIntoView({block:'center',behavior:'smooth'}));await d.page.waitForTimeout(1000)}await loc.first().evaluate(el=>el.classList.add('demo-focus')).catch(()=>{});}}await d.page.evaluate(m=>{let c=document.getElementById('demo-caption');if(!c){c=document.createElement('div');c.id='demo-caption';c.innerHTML='<small></small><strong></strong><p></p>';document.body.appendChild(c)}c.querySelector('small').textContent=m.chapter+' · '+String(m.number).padStart(2,'0');c.querySelector('strong').textContent=m.title;c.querySelector('p').textContent=m.text;if(window.innerWidth<500){const dialogs=[...document.querySelectorAll('[role=dialog]')];const dialog=dialogs.at(-1);if(dialog&&dialog.getBoundingClientRect().top>=100){c.style.top='64px';c.style.bottom='auto'}else{c.style.top='auto';c.style.bottom='108px'}}},meta);});
 const s={...meta,startAt:Date.now(),screenshots:{}};recording.scenes.push(s);
 await all(async d=>{await d.page.waitForTimeout(350);s.screenshots[d.name]=join(out,`escena-${String(n).padStart(2,'0')}-${d.name}.png`);await d.page.screenshot({path:s.screenshots[d.name]});});
 await new Promise(r=>setTimeout(r,process.env.DEMO_QUICK==='1'?1500:6500));
 await all(d=>d.page.locator('.demo-focus').evaluateAll(ns=>ns.forEach(n=>n.classList.remove('demo-focus'))));
 s.holdEndAt=Date.now();await writeFile(join(out,'grabacion.json'),JSON.stringify(recording,null,2));console.log('ESCENA',chapter,n,meta.title);
}
async function showMenu(n,route){await all(d=>menu(d,route));await scene(n,d=>d.page.getByRole('menu').locator(`a[href="${route}"]:visible`));await all(hideMenu)}
const entry=d=>d.mobile?d.page.getByRole('navigation',{name:'Acciones del mostrador'}).getByRole('button',{name:/Entrada/}):d.page.getByRole('button',{name:/Registrar entrada/i}).first();
const receipt=d=>d.page.getByRole('dialog').filter({has:d.page.getByRole('heading',{name:/Comprobante de (entrada|salida)/i})}).last();
async function scrollReceipt(d,where){const r=receipt(d);await r.evaluate((el,where)=>{const inner=[...el.querySelectorAll('*')].find(n=>getComputedStyle(n).overflowY==='auto'&&n.scrollHeight>n.clientHeight);if(inner)inner.scrollTo({top:where==='end'?inner.scrollHeight:240,behavior:'smooth'})},where);await d.page.waitForTimeout(1300)}
async function prepareEntry(d,plate){await go(d,'/tickets');await tap(d,entry(d));const dialog=d.page.getByRole('dialog').last();await dialog.locator('input[name=licensePlate]').fill(plate);await dialog.getByRole('radio',{name:/Auto/i}).waitFor({timeout:45000});await tap(d,dialog.getByRole('radio',{name:/Auto/i}));await tap(d,dialog.getByRole('button',{name:/Registrar entrada/i}));await receipt(d).waitFor({timeout:45000});await closeDialog(d);}
async function findVehicle(d,plate){if(d.mobile){const allBtn=d.page.getByRole('button',{name:/^Ver todos$|^Ver los .*vehículos$/i}).first();if(await allBtn.isVisible().catch(()=>false))await tap(d,allBtn);const q=d.page.getByPlaceholder('Buscar patente, ficha o apellido');await q.fill(plate);await d.page.waitForTimeout(600);await tap(d,d.page.getByRole('button',{name:new RegExp(plate)}).first());}else{const q=d.page.getByRole('combobox',{name:/Buscar un vehículo/i});await q.fill(plate);await d.page.waitForTimeout(750);await tap(d,d.page.getByRole('option',{name:new RegExp(plate)}).first());}await d.page.getByRole('heading',{name:'Cobrar salida',exact:true}).waitFor();}
async function settleDemo(d,method='TRANSFER'){const dialog=d.page.getByRole('dialog').last();if(await dialog.getByRole('button',{name:/^Transferencia/}).count())await tap(d,dialog.getByRole('button',{name:/^Transferencia/}));await tap(d,dialog.getByRole('button',{name:/Cobrar y registrar salida|^Registrar salida$/}));await receipt(d).waitFor({timeout:45000});}


let nextScene=0;
const dg=d=>d.page.getByRole('dialog').last();
const shift=d=>d.page.getByRole('button',{name:/Abrir mi turno|^Mi turno$|Turno abierto/}).first();
const frameEnd=()=>{if(recording.scenes.length)recording.scenes.at(-1).endAt=Date.now()};
async function step(title,text,target=null,options={}){
 const n=++nextScene;metadata.set(n,{number:n,chapter:part==='configuracion'?'CONFIGURACIÓN DE TURNOS':['salida','pago'].includes(part)?'BUSCAR Y COBRAR':part==='apertura'?'ABRIR EL TURNO':'CIERRE E HISTORIAL',title,text});
 await scene(n,target,options);
 // El rótulo interno se oculta: la explicación completa ya está arriba de los dispositivos.
}
async function showLocation(route,text){
 await all(d=>menu(d,route));await step('Dónde estamos',text,d=>d.page.getByRole('menu').locator(`a[href="${route}"]:visible`));await all(hideMenu);
}
async function configure(){
 await all(d=>go(d,'/admin/configuracion/operacion'));
 await showLocation('/admin/configuracion','Abrimos el menú de la cuenta y entramos a Administración, Configuración, Operación. La pestaña Turnos de caja tiene cuatro pasos: Activar, Modo, Cajas y Sueldo.');
 await step('1 · Activar turnos de caja','Activar turnos de caja identifica los cobros de cada usuario. Con turnos activos, necesitás abrir el tuyo antes de cobrar en efectivo. Apagados, podés cobrar sin turno y el historial anterior se conserva.',d=>d.page.locator('#shifts-enabled'));
 await step('Guardar cada paso','Continuar guarda los cambios de Activar y Modo antes de pasar al siguiente paso. En esta demostración revisamos la configuración actual. Para apagar turnos o cambiar de modo, primero hay que cerrar todos los turnos abiertos.',d=>d.page.getByRole('button',{name:'Continuar',exact:true}));
 await all(d=>tap(d,d.page.getByRole('button',{name:/Paso 2: Modo/})));
 await step('2 · Una caja con relevos','Con turnos múltiples apagado trabaja un operador a la vez en la caja principal. Al terminar cuenta el dinero y deja un fondo. El siguiente operador recibe lo que quedó en esa misma caja.',d=>d.page.locator('#multiple-shifts'));
 await all(d=>tap(d,d.page.locator('#multiple-shifts')));
 await step('Varios operadores y varias entradas','Activado, cada usuario elige una caja. Pueden trabajar en cajones distintos o compartir el mismo. Compartir caja no duplica su fondo: cada uno tiene su turno y el último cuenta todo el efectivo. Mostramos esta opción sin guardarla.',d=>d.page.locator('#multiple-shifts'));
 await all(d=>tap(d,d.page.locator('#multiple-shifts')));
 await all(d=>tap(d,d.page.getByRole('button',{name:/Paso 3: Cajas/})));
 await step('3 · Cajas físicas','Una caja representa un cajón de efectivo. En modo simple se usa la principal. Con turnos múltiples podés crear más cajas y elegir cuál corresponde a cada entrada. Dos operadores que usan el mismo cajón deben elegir la misma caja.',d=>d.page.getByRole('heading',{name:'Cajas físicas',exact:true}));
 await step('Fondo objetivo protegido','El fondo objetivo es el cambio que querés conservar en el cajón. Sirve como referencia al abrir y se protege al calcular el sueldo y el retiro de recaudación. Guardar caja aplica su nombre y fondo; acá mantenemos los valores actuales.',d=>d.page.getByLabel('Fondo objetivo protegido'));
 await all(d=>tap(d,d.page.getByRole('button',{name:/Paso 4: Sueldo/})));
 await step('4 · Sueldo del operador','El retiro automático de sueldo es opcional. Se configura un importe por jornada y se descuenta una sola vez al finalizarla, si hay dinero suficiente para conservar el fondo. Los cambios rigen para nuevas jornadas.',d=>d.page.locator('#salary-enabled'));
 await all(d=>tap(d,d.page.locator('#salary-enabled')));await all(d=>d.page.locator('#salary-amount').fill('20000'));
 await step('Importe por jornada, sin guardar el ejemplo','Al activarlo aparece el importe. Escribimos veinte mil pesos sólo para mostrar dónde se carga. Guardar lo aplicaría; salimos sin guardar para conservar la configuración. Si no alcanza el efectivo para sueldo y fondo, no se descuenta y queda una alerta.',d=>d.page.locator('#salary-amount'));
 await all(d=>tap(d,d.page.locator('#salary-enabled')));
 await step('Qué ocurre a las 00:00','El corte de medianoche separa las operaciones en la planilla del nuevo día. La caja continúa abierta y el operador sigue trabajando: este corte no retira el sueldo ni exige volver a contar el cajón. La jornada termina cuando cerrás tu turno.',d=>d.page.getByRole('heading',{name:'Sueldo del operador',exact:true}));
 frameEnd();
}
async function opening(){
 await all(d=>go(d,'/tickets'));await showLocation('/tickets','Desde el menú entramos a Operación, Tickets. En el mostrador están las entradas, las salidas y el acceso a tu turno. Usamos la misma cuenta en notebook y celular: es el mismo turno, no dos turnos distintos.');
 await step('Abrir mi turno','Tocamos Abrir mi turno antes de comenzar a cobrar en efectivo. El turno queda a nombre del usuario conectado; no se escribe ni se cambia el nombre. Las operaciones de esta cuenta se registran con ese responsable.',shift);
 await all(d=>tap(d,shift(d)));
 await step('De quién viene el fondo','La apertura indica quién dejó la caja, cuándo la cerró, cuánto efectivo dejó y cuántos vehículos había. Así podés comprobar de qué relevo viene el fondo y cuántos siguen dentro ahora.',d=>dg(d).getByRole('region',{name:'Lo que recibís del turno anterior'}));
 await step('Contá lo que recibís','Compará el efectivo físico con lo informado. Recibí todo completa el importe esperado; si hay una diferencia, ingresá lo que realmente recibiste y explicá el motivo. No uses este campo para inventar un ingreso de ventas.',d=>dg(d).locator('#cash-received'));
 await all(d=>tap(d,dg(d).locator('summary').filter({hasText:'Agregar cambio'})));
 await step('Agregar cambio es opcional','Desplegamos Agregar cambio sólo si sumamos dinero de afuera para el cajón. Este importe se agrega al fondo recibido. No es una venta. En una caja ya abierta, otro operador se une sin volver a cargar el mismo fondo.',d=>dg(d).locator('#cash-added'));
 await all(d=>tap(d,dg(d).locator('summary').filter({hasText:'Agregar cambio'})));
 await step('Confirmar la apertura','Después de contar, tocamos Abrir caja y mi turno. Si la caja ya estaba abierta y se permiten varios turnos, el botón permite unirte a ella. Como ambos dispositivos usan la misma cuenta, confirmamos la apertura una sola vez.',d=>dg(d).getByRole('button',{name:'Abrir caja y mi turno',exact:true}));
 frameEnd();await tap(ds[0],dg(ds[0]).getByRole('button',{name:'Abrir caja y mi turno',exact:true}));await ds[0].page.getByRole('dialog').waitFor({state:'hidden'});await closeDialog(ds[1]);await all(d=>go(d,'/tickets'));await all(d=>tap(d,shift(d)));
 await step('Mi turno: efectivo de toda la caja','Con el turno abierto aparece el efectivo esperado. Incluye el fondo inicial, los cobros en efectivo y los movimientos de todos los operadores que comparten esa caja. No es lo mismo que la recaudación de tu usuario.',d=>dg(d).getByRole('region',{name:'Tu turno en curso'}));
 await step('Tu resumen de operaciones','El resumen separa efectivo, Mercado Pago y transferencias. También muestra retiros y vehículos recibidos y salidos. Los vehículos corresponden a toda la playa durante el turno; las operaciones de dinero conservan su usuario.',d=>dg(d).getByRole('region',{name:'Resumen del turno'}));
 frameEnd();await all(closeDialog);
}
async function findCurrent(d){
 if(d.mobile){await tap(d,d.page.getByRole('button',{name:/^(Cobrar salida|Salida)/i}).first());await dg(d).getByRole('textbox',{name:'Buscar vehículo'}).fill(d.plate);await d.page.waitForTimeout(900);await tap(d,dg(d).getByRole('button',{name:new RegExp(d.plate)}));}
 else{const q=d.page.getByRole('combobox',{name:'Buscar un vehículo'});await q.fill(d.plate);await d.page.waitForTimeout(900);await tap(d,d.page.getByRole('option',{name:new RegExp(d.plate)}));}
 await d.page.getByRole('heading',{name:'Cobrar salida',exact:true}).waitFor();
}
async function output(){
 if(!process.env.DEMO_REUSE_ENTRIES){for(const d of ds)await prepareEntry(d,d.plate);}
 await all(d=>go(d,'/tickets'));await showLocation('/tickets','Volvemos a Operación, Tickets. Antes de cobrar buscamos la patente del vehículo activo. Podés usar el buscador de la notebook, Cobrar salida en el celular o tocar el vehículo en el tablero.');
 await all(async d=>{if(d.mobile)await tap(d,d.page.getByRole('button',{name:/^(Cobrar salida|Salida)/i}).first())});
 await step('Buscar por patente o apellido','En la notebook usamos Buscar un vehículo. En el celular se abre una lista de los que están adentro. Escribimos la patente de prueba para reducir las coincidencias y elegir exactamente la estadía que vamos a cobrar.',d=>d.mobile?dg(d).getByRole('textbox',{name:'Buscar vehículo'}):d.page.getByRole('combobox',{name:'Buscar un vehículo'}));
 await all(async d=>{const q=d.mobile?dg(d).getByRole('textbox',{name:'Buscar vehículo'}):d.page.getByRole('combobox',{name:'Buscar un vehículo'});await q.fill(d.plate);await d.page.waitForTimeout(1000)});
 await step('Elegir el vehículo encontrado','Tocamos la patente que coincide. Se abre Cobrar salida con el ingreso, el tiempo transcurrido, el total y el saldo. Revisá que sea el vehículo correcto antes de elegir cómo paga.',d=>(d.mobile?dg(d).getByRole('button',{name:new RegExp(d.plate)}):d.page.getByRole('option',{name:new RegExp(d.plate)})).first());
 await all(d=>tap(d,(d.mobile?dg(d).getByRole('button',{name:new RegExp(d.plate)}):d.page.getByRole('option',{name:new RegExp(d.plate)})).first()));
 await step('Revisar el cálculo','El importe usa la tarifa fijada para esta estadía, el tipo de vehículo y sus reglas. Revisá tiempo, total y saldo pendiente. Si hubo un anticipo, se descuenta del saldo; abrir el detalle permite comprobar cómo se calculó.',dg);
 await step('Medios de pago antes de confirmar','Efectivo y transferencia manual los confirma el operador. QR y Al alias consultan el Mercado Pago de la empresa. No son cuatro pagos a realizar: elegís el medio que usa este cliente. Ahora mostramos cada opción antes de registrar la salida.',d=>dg(d).getByRole('button',{name:/^Efectivo/}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Efectivo/})));
 await all(d=>tap(d,dg(d).getByRole('button',{name:'Otro',exact:true})));await all(d=>dg(d).locator('#paga-con-otro').fill('10000'));
 await step('Efectivo y vuelto','En efectivo podés elegir un billete o escribir Otro para calcular el vuelto. Acá mostramos diez mil pesos. El vuelto es una ayuda: contá lo que recibiste y recién entonces confirmá el cobro. Con turnos activos, tu turno debe estar abierto.',d=>dg(d).locator('#paga-con-otro'));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Transferencia/})));
 await step('Transferencia manual','Esta opción registra una transferencia que verificaste por tu cuenta. Confirmá sólo después de ver el dinero acreditado. No consulta automáticamente el banco y no debe confundirse con Al alias, que verifica la cuenta de Mercado Pago vinculada.',d=>dg(d).getByRole('button',{name:/^Transferencia/}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^QR \/ celular/})));
 await step('QR: generar el cobro','Tocamos QR / celular y Mostrar el QR. El sistema genera un código por el saldo de esta estadía. El administrador vincula Mercado Pago desde Configuración; si la playa tiene el QR interoperable activo, se paga con bancos y billeteras compatibles.',d=>dg(d).getByRole('button',{name:/^Mostrar el QR/i}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Mostrar el QR/i})));await all(d=>dg(d).getByText('Esperando el pago',{exact:true}).waitFor({timeout:60000}));
 await step('Escanear y esperar la acreditación','El cliente escanea el QR y paga desde su aplicación. La pantalla espera la confirmación de Mercado Pago. No registres una transferencia manual por ese mismo pago: esperá su acreditación para evitar cobrar o registrar dos veces.',d=>dg(d).getByText('Escaneá para pagar',{exact:true}));
 await step('QR confirmado: salida automática','Si el pago confirmado cubre el saldo, el sistema registra también la salida y muestra la confirmación. Si quedó una diferencia porque la tarifa cambió mientras pagaba, recarga la estadía para cobrar el resto. Acá mostramos la espera sin realizar un pago real.',d=>dg(d).getByText('Esperando el pago',{exact:true}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cancelar QR y cobrar de otra forma/})));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Al alias/})));
 await step('Al alias: verificación automática','Con la cuenta vinculada y la función habilitada, elegimos Al alias y Esperar la transferencia. El cliente transfiere el importe exacto al alias de la empresa. Esta espera busca el pago automáticamente en Mercado Pago.',d=>dg(d).getByRole('button',{name:/^Esperar la transferencia/i}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Esperar la transferencia/i})));await all(d=>dg(d).getByText('Importe exacto a transferir',{exact:true}).waitFor({timeout:60000}));
 await step('Copiar alias e importe exacto','Copiá el alias para compartirlo y pedí transferir exactamente el importe que muestra la pantalla. El sistema compara transferencias recibidas en la cuenta vinculada. La verificación requiere conexión; mostrar un comprobante del cliente no reemplaza la acreditación.',d=>dg(d).getByRole('button',{name:/Copiar alias/}));
 await step('Salida y revisión de coincidencias','Si hay una única transferencia compatible y se confirma, registra el cobro y la salida solo, con su operador. Si hay pagos iguales o varias coincidencias, pide revisión. Compará pagador, hora y operación antes de elegir el pago correcto.',d=>dg(d).getByText('Importe exacto a transferir',{exact:true}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cancelar y cobrar de otra forma/})));
 await all(async d=>{const b=dg(d).getByRole('button',{name:'Entendido',exact:true});if(await b.isVisible().catch(()=>false))await tap(d,b)});
 await step('Buscar con la cámara del celular','También podés escanear la patente con la cámara del celular para encontrar la estadía. El escáner identifica el vehículo: después elegís el medio de pago. Mostramos el video original del escaneo, sin tapar su contenido.',null,{camera:'salida'});
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Efectivo/})));await all(async d=>{const b=dg(d).getByRole('button',{name:'Justo',exact:true});if(await b.count())await tap(d,b)});
 await step('Confirmar el cobro y la salida','Terminamos este ejemplo en efectivo. Después de recibir el importe, tocamos Cobrar y registrar salida. Los QR y las esperas por alias del ejemplo se cancelaron: no realizamos ningún pago real por Mercado Pago.',d=>dg(d).getByRole('button',{name:/Cobrar y registrar salida/}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cobrar y registrar salida/})));await all(d=>receipt(d).waitFor({timeout:60000}));
 await all(d=>tap(d,receipt(d).getByRole('button',{name:/Ver comprobante completo/})));
 await step('Comprobante de salida','El comprobante conserva la patente, los horarios, el total, el medio de pago y el usuario responsable. Desplazamos el papel para revisar toda la información antes de entregarlo. También se puede volver a consultar desde Comprobantes.',d=>receipt(d).locator('#comprobante-papel'));
 await all(d=>scrollReceipt(d,'end'));
 await step('Entregar o volver a imprimir','Desde el comprobante podés compartir su enlace, mostrar el QR que abre el documento o imprimirlo, según la configuración. Este QR es para ver el comprobante; es distinto del QR de Mercado Pago que usamos para cobrar.',receipt);
 frameEnd();await all(closeDialog);
}
async function paymentResume(){
 await all(d=>go(d,'/tickets'));await all(findCurrent);
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^QR \/ celular/})));
 await step('QR: generar el cobro','Tocamos QR / celular y Mostrar el QR. El sistema genera un código por el saldo de esta estadía. El administrador vincula Mercado Pago desde Configuración; si la playa tiene el QR interoperable activo, se paga con bancos y billeteras compatibles.',d=>dg(d).getByRole('button',{name:/^Mostrar el QR/i}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Mostrar el QR/i})));await all(d=>dg(d).getByText('Esperando el pago',{exact:true}).waitFor({timeout:60000}));
 await step('Escanear y esperar la acreditación','El cliente escanea el QR y paga desde su aplicación. La pantalla espera la confirmación de Mercado Pago. No registres una transferencia manual por ese mismo pago: esperá su acreditación para evitar cobrar o registrar dos veces.',d=>dg(d).getByText('Escaneá para pagar',{exact:true}));
 await step('QR confirmado: salida automática','Si el pago confirmado cubre el saldo, el sistema registra también la salida y muestra la confirmación. Si quedó una diferencia porque la tarifa cambió mientras pagaba, recarga la estadía para cobrar el resto. Acá mostramos la espera sin realizar un pago real.',d=>dg(d).getByText('Esperando el pago',{exact:true}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cancelar QR y cobrar de otra forma/})));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Al alias/})));
 await step('Al alias: verificación automática','Con la cuenta vinculada y la función habilitada, elegimos Al alias y Esperar la transferencia. El cliente transfiere el importe exacto al alias de la empresa. Esta espera busca el pago automáticamente en Mercado Pago.',d=>dg(d).getByRole('button',{name:/^Esperar la transferencia/i}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Esperar la transferencia/i})));await all(d=>dg(d).getByText('Importe exacto a transferir',{exact:true}).waitFor({timeout:60000}));
 await step('Copiar alias e importe exacto','Copiá el alias para compartirlo y pedí transferir exactamente el importe que muestra la pantalla. El sistema compara transferencias recibidas en la cuenta vinculada. La verificación requiere conexión; mostrar un comprobante del cliente no reemplaza la acreditación.',d=>dg(d).getByRole('button',{name:/Copiar alias/}));
 await step('Salida y revisión de coincidencias','Si hay una única transferencia compatible y se confirma, registra el cobro y la salida solo, con su operador. Si hay pagos iguales o varias coincidencias, pide revisión. Compará pagador, hora y operación antes de elegir el pago correcto.',d=>dg(d).getByText('Importe exacto a transferir',{exact:true}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cancelar y cobrar de otra forma/})));
 await all(async d=>{const b=dg(d).getByRole('button',{name:'Entendido',exact:true});if(await b.isVisible().catch(()=>false))await tap(d,b)});
 await step('Buscar con la cámara del celular','También podés escanear la patente con la cámara del celular para encontrar la estadía. El escáner identifica el vehículo: después elegís el medio de pago. Mostramos el video original del escaneo, sin tapar su contenido.',null,{camera:'salida'});
 await all(d=>tap(d,dg(d).getByRole('button',{name:/^Efectivo/})));await all(async d=>{const b=dg(d).getByRole('button',{name:'Justo',exact:true});if(await b.count())await tap(d,b)});
 await step('Confirmar el cobro y la salida','Terminamos este ejemplo en efectivo. Después de recibir el importe, tocamos Cobrar y registrar salida. Los QR y las esperas por alias del ejemplo se cancelaron: no realizamos ningún pago real por Mercado Pago.',d=>dg(d).getByRole('button',{name:/Cobrar y registrar salida/}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cobrar y registrar salida/})));await all(d=>receipt(d).waitFor({timeout:60000}));
 await all(d=>tap(d,receipt(d).getByRole('button',{name:/Ver comprobante completo/})));
 await step('Comprobante de salida','El comprobante conserva la patente, los horarios, el total, el medio de pago y el usuario responsable. Desplazamos el papel para revisar toda la información antes de entregarlo. También se puede volver a consultar desde Comprobantes.',d=>receipt(d).locator('#comprobante-papel'));
 await all(d=>scrollReceipt(d,'end'));
 await step('Entregar o volver a imprimir','Desde el comprobante podés compartir su enlace, mostrar el QR que abre el documento o imprimirlo, según la configuración. Este QR es para ver el comprobante; es distinto del QR de Mercado Pago que usamos para cobrar.',receipt);
 frameEnd();await all(closeDialog);
}
async function ending(){
 await all(d=>go(d,'/tickets'));await showLocation('/tickets','Volvemos a Tickets y abrimos Mi turno, o Turno abierto en el celular. Ahora vemos el resumen después de las dos salidas de prueba.');await all(d=>tap(d,shift(d)));
 await step('Revisar los cobros del turno','El resumen separa efectivo, Mercado Pago y transferencias. Los retiros se muestran aparte, con sus motivos. Los vehículos recibidos, las salidas y los que quedan adentro permiten comprobar el relevo de toda la playa.',d=>dg(d).getByRole('region',{name:'Resumen del turno'}));
 await step('Dinero que se saca o agrega al cajón','El administrador puede registrar un retiro o un aporte de efectivo durante la jornada. Quedan usuario y motivo. Esto mueve el dinero físico de la caja; no reemplaza una venta ni un gasto de la planilla. Mostramos el formulario sin cargar movimientos.',d=>dg(d).getByRole('region',{name:'Movimientos de efectivo'}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:'Retirar efectivo',exact:true})));
 await step('Retiro durante la jornada','Ingresás cuánto retirás y para qué. La pantalla anticipa cuánto quedaría en el cajón. Si agregás cambio, elegís Agregar efectivo. En esta demostración no confirmamos retiros ni aportes para conservar el fondo.',d=>dg(d).getByRole('region',{name:'Movimientos de efectivo'}));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Cerrar mi turno y contar la caja|Cerrar sólo mi turno/})));
 await step('Quién cuenta al cerrar','Si quedan otros operadores en esa caja, cerrás sólo tu turno y la caja sigue abierta. El último operador cuenta todo el efectivo acumulado desde la apertura de la caja, incluyendo fondo y operaciones de todos. En esta caja somos el último operador.',d=>dg(d).getByRole('heading'));
 await step('Contar el efectivo real','Ingresá cuánto contaste. Conté todo completa lo esperado; si falta o sobra, cargá el importe real y explicá el motivo de la diferencia. La cuenta debe representar el cajón físico, no sólo los cobros de tu usuario.',d=>dg(d).locator('#cash-counted'));
 await all(d=>tap(d,dg(d).getByRole('button',{name:/Conté todo/})));
 await step('Retiro de recaudación y fondo siguiente','El retiro de recaudación es lo que sacás al cerrar, sin incluir sueldo. Dejar el fondo calcula el retiro para conservar el fondo objetivo; No retiro efectivo deja todo. El desglose indica cuánto queda para el próximo operador antes de confirmar.',d=>dg(d).locator('#cash-withdrawn'));
 await step('Notas, sueldo y confirmación','Podés agregar una nota para el próximo turno: se publica en Avisos. Si está configurado, el sueldo se calcula por separado al finalizar la jornada. Revisá contado, retiros y fondo siguiente antes de confirmar el cierre del turno y la caja.',d=>dg(d).getByRole('button',{name:/^Confirmar cierre de turno y caja/i}));
 frameEnd();await tap(ds[0],dg(ds[0]).getByRole('button',{name:/^Confirmar cierre de turno y caja/i}));await ds[0].page.getByRole('dialog').waitFor({state:'hidden'});await closeDialog(ds[1]);
 await all(d=>go(d,'/admin/caja?tab=turnos'));await showLocation('/admin/caja','Abrimos Administración, Caja, y la pestaña Turnos. El administrador revisa las cajas abiertas, sus operadores y el historial de cierres desde esta sección.');
 await all(d=>d.page.getByRole('heading',{name:'Cajas y turnos abiertos'}).waitFor());await all(d=>d.page.getByText('Cargando cajas…',{exact:true}).waitFor({state:'hidden'}));
 await step('Cajas abiertas, sin duplicar efectivo','El panel suma el efectivo una sola vez por caja, aunque trabajen varios operadores. Cada caja muestra su fondo o saldo y sus turnos. El administrador puede cerrar un turno ajeno, pero debe indicar un motivo.',d=>d.page.getByRole('heading',{name:'Cajas y turnos abiertos',exact:true}));
 await step('Filtrar el historial','En Historial de turnos elegís Hoy, siete días, treinta días o Todos y podés filtrar por usuario. Cada registro conserva fechas y responsable. Abrimos el cierre de nuestra demostración para revisar los importes.',d=>d.page.getByRole('group',{name:'Período'}));
 await all(d=>d.page.locator('[data-tour=caja-tabla] details').first().waitFor());await all(d=>tap(d,d.page.locator('[data-tour=caja-tabla] details').first().locator('summary')));
 await step('Detalle del cierre','El detalle reúne fondo inicial, efectivo esperado y contado, cobros por medio de pago, retiros y vehículos. Deja al siguiente turno indica el efectivo disponible para la próxima apertura de esta caja; no se incluye como dinero retirado.',d=>d.page.locator('[data-tour=caja-tabla] details[open]').getByRole('region',{name:'Resumen del turno'}));
 const cut=d=>d.page.locator('[data-tour=caja-tabla] details').filter({hasText:'Corte de las 00:00'}).first();
 await all(d=>tap(d,cut(d).locator('summary')));
 await step('Corte diario no es cierre del cajón','Los registros Corte de las 00:00 separan los días. El sistema continúa la caja y la jornada en la nueva planilla, sin retirar sueldo. El cierre físico y el arqueo los realiza el último operador cuando termina; por eso el historial distingue ambos casos.',d=>cut(d));
 frameEnd();
}
try{
 const state=await authenticate('ADMIN');
 for(const mobile of [false,true]){
  const name=mobile?'celular':'notebook';const contextStartedAt=Date.now();
  const context=await browser.newContext({...mobile?devices['iPhone 13']:{viewport:{width:1600,height:900}},viewport:mobile?{width:390,height:844}:{width:1600,height:900},deviceScaleFactor:1,recordVideo:{dir:out,size:mobile?{width:390,height:844}:{width:1600,height:900}},storageState:state,serviceWorkers:'block'});
  await context.addInitScript(installDemoSkin,{mobile});
  await context.addInitScript(()=>{const hide=()=>{const style=document.createElement('style');style.textContent='#demo-caption{display:none!important}';document.head.appendChild(style)};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',hide,{once:true}):hide()});
  const pageCreationAt=Date.now(),page=await context.newPage(),videoStartedAt=Date.now();
  const d={name,mobile,context,page,plate:mobile?'ZZ913ZX':'ZZ912ZX'};ds.push(d);recording.devices[name]={contextStartedAt,pageCreationAt,videoStartedAt,viewport:mobile?{width:390,height:844}:{width:1600,height:900},plate:d.plate};
 }
 await ({configuracion:configure,apertura:opening,salida:output,pago:paymentResume,cierre:ending}[part])();recording.endedAt=Date.now();
 await all(async d=>{const v=d.page.video();await d.context.close();await copyFile(await v.path(),join(out,`${d.name}.webm`));recording.devices[d.name].file=join(out,`${d.name}.webm`)});
 await writeFile(join(out,'grabacion.json'),JSON.stringify(recording,null,2));console.log('LISTO',part,recording.scenes.length);
}catch(e){recording.error=e.message;recording.endedAt=Date.now();await writeFile(join(out,'grabacion-error.json'),JSON.stringify(recording,null,2));await all(d=>d.page.screenshot({path:join(out,`error-${d.name}.png`)}).catch(()=>{}));throw e}finally{await browser.close()}
