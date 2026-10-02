/**
 * Genera recorridos visuales mudos para el landing a partir de capturas reales
 * incluidas en public/screens. No simula clics ni acciones del sistema.
 * Uso: node scripts/generar-videos.mjs
 */
import { chromium } from 'playwright';
import { readFile, mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const output = join(root, 'public', 'videos');
await mkdir(output, { recursive: true });

const guides = [
  {
    name: 'entrada',
    image: 'operacion-desktop.png',
    title: 'Registrar una entrada',
    steps: [
      ['01', 'Elegí registrar entrada', 'Por patente o ficha física, según cómo trabaja tu playa.'],
      ['02', 'Indicá el vehículo', 'Seleccioná el tipo para aplicar la tarifa correspondiente.'],
      ['03', 'Confirmá el ingreso', 'La estadía queda activa y se genera el comprobante.'],
    ],
  },
  {
    name: 'tarifas',
    image: 'tarifas-desktop.png',
    title: 'Preparar tus tarifas',
    steps: [
      ['01', 'Definí tipos y horarios', 'Configurá vehículos y los horarios de día y noche.'],
      ['02', 'Cargá los precios', 'Indicá cuánto se cobra para cada duración.'],
      ['03', 'Probá el cálculo', 'Revisá el resultado antes de empezar a operar.'],
    ],
  },
  {
    name: 'salida',
    image: 'tickets-desktop-hd.png',
    title: 'Cobrar una salida',
    steps: [
      ['01', 'Encontrá la estadía', 'Buscá la patente o escaneá la ficha.'],
      ['02', 'Revisá el importe', 'El sistema muestra el tiempo y la tarifa aplicada.'],
      ['03', 'Registrá el cobro', 'Elegí el medio de pago y guardá la salida.'],
    ],
  },
];

const browser = await chromium.launch({ channel: 'chrome' });
for (const guide of guides) {
  const image = (await readFile(join(root, 'public', 'screens', guide.image))).toString('base64');
  const context = await browser.newContext({
    viewport: { width: 960, height: 540 },
    recordVideo: { dir: output, size: { width: 960, height: 540 } },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.setContent(`<!doctype html><html lang="es"><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;background:#11100e;color:#fffdf6;font-family:Arial,sans-serif;overflow:hidden}
    .bar{height:6px;background:linear-gradient(90deg,#ffc91c,#f36b2b)}
    .header{height:104px;display:flex;align-items:center;justify-content:space-between;padding:0 46px}
    .brand{color:#ffc91c;font-weight:900;letter-spacing:.08em;font-size:15px}.header small{color:#a69c8c;font-weight:700;letter-spacing:.14em}
    .scene{display:grid;grid-template-columns:415px 1fr;gap:30px;padding:0 46px}
    .copy{padding:28px 0}.step{color:#ffc91c;font-size:15px;font-weight:800;letter-spacing:.16em}
    h1{font-size:43px;line-height:1.02;text-transform:uppercase;margin:22px 0 16px;letter-spacing:-.04em}
    p{color:#c6beb1;font-size:19px;line-height:1.5;margin:0}
    .screen{height:327px;overflow:hidden;border:5px solid #332c20;border-radius:18px;box-shadow:0 14px 0 #3b2c09;background:#1a1713}
    img{width:100%;height:100%;object-fit:cover;object-position:top left}
    .footer{position:absolute;left:46px;right:46px;bottom:27px;display:flex;align-items:center;gap:9px}
    .footer span{height:5px;flex:1;border-radius:10px;background:#3f392e}.footer span.on{background:#ffc91c}
    .footer b{font-size:12px;color:#ae9d77;margin-left:14px}
  </style><div class="bar"></div><div class="header"><span class="brand">◆ ESTACIONAMIENTO</span><small>RECORRIDO VISUAL</small></div><div class="scene"><div class="copy"><div class="step" id="step"></div><h1 id="title"></h1><p id="desc"></p></div><div class="screen"><img src="data:image/png;base64,${image}" alt=""></div></div><div class="footer"><span></span><span></span><span></span><b>${guide.title}</b></div></html>`);
  for (let index = 0; index < guide.steps.length; index++) {
    const [number, title, desc] = guide.steps[index];
    await page.evaluate(({ index, number, title, desc }) => {
      document.querySelector('#step').textContent = number + ' / 03';
      document.querySelector('#title').textContent = title;
      document.querySelector('#desc').textContent = desc;
      document.querySelectorAll('.footer span').forEach((el, i) => el.classList.toggle('on', i <= index));
    }, { index, number, title, desc });
    await page.waitForTimeout(3000);
  }
  const video = page.video();
  await context.close();
  await rename(await video.path(), join(output, guide.name + '.webm'));
  console.log('Generado:', guide.name + '.webm');
}
await browser.close();
