/** Pantallas iniciales de marca para las guías. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const output = join(root, 'public', 'video-posters');
await mkdir(output, { recursive: true });
const guides = [
  ['operacion', '01', 'OPERACIÓN', 'Entrada y comprobante'],
  ['cobro', '02', 'COBRO', 'Turnos, búsqueda y salida'],
  ['tarifas', '03', 'TARIFAS', 'Precios por tiempo y estadía'],
  ['caja', '04', 'CAJA', 'Movimientos y planilla'],
  ['inquilinos', '05', 'MENSUALES', 'Inquilinos'],
  ['administracion', '06', 'ADMINISTRACIÓN', 'Acceso y configuración'],
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  for (const [name, number, category, title] of guides) {
    await page.setContent(`<!doctype html><html lang="es"><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{margin:0;width:1600px;height:900px;overflow:hidden;background:#11100e;color:#f6f2e8;font-family:Arial,sans-serif}
      .grain{position:absolute;inset:0;background:radial-gradient(circle at 50% 32%,rgba(255,202,37,.13),transparent 34%),radial-gradient(circle at 80% 85%,rgba(242,106,41,.08),transparent 36%)}
      .edge{position:absolute;inset:30px;border:1px solid #5b4c29;border-radius:24px}
      .top{position:absolute;top:30px;left:30px;right:30px;height:9px;border-radius:24px 24px 0 0;background:repeating-linear-gradient(130deg,#ffc91c 0 22px,#11100e 22px 35px)}
      .content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:50px}
      .mark{width:172px;height:172px;border-radius:39px;background:#0b0b0a;border:2px solid #5a4518;box-shadow:0 28px 90px #0009,0 0 95px #efaa1b24;display:grid;place-items:center;margin-bottom:35px}
      .brand{font-size:25px;font-weight:900;letter-spacing:.28em;color:#ffc91c;margin:0 0 50px 7px}
      .rule{width:130px;height:3px;background:linear-gradient(90deg,#ffc91c,#f36b2b);border-radius:3px;margin-bottom:25px}
      .eyebrow{font-size:20px;font-weight:800;letter-spacing:.25em;color:#d4bb7a;margin-bottom:18px}
      h1{font-size:70px;line-height:1.08;letter-spacing:-.055em;margin:0;max-width:1250px}
      .bottom{position:absolute;bottom:72px;color:#a99f8f;font-size:18px;letter-spacing:.08em}
    </style><div class="grain"></div><div class="edge"></div><div class="top"></div>
    <main class="content"><div class="mark"><svg width="125" height="125" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="g" x1="12" y1="16" x2="52" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#ffc91c"/><stop offset="1" stop-color="#f36b2b"/></linearGradient></defs><path d="M15 47 V19 L25.5 33.5 L33.2 17.8 L40.9 33.5 L51.4 19 V47" fill="none" stroke="url(#g)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></svg></div>
    <p class="brand">ESTACIONAMIENTO</p><div class="rule"></div><span class="eyebrow">GUÍA ${number} · ${category}</span><h1>${title}</h1></main>
    <div class="bottom" style="left:80px">RECORRIDO PASO A PASO</div><div class="bottom" style="right:80px">${number} / 06</div></html>`);
    await page.screenshot({ path: join(output, `intro-${name}.png`) });
    console.log(`intro-${name}.png`);
  }
  await page.close();
} finally { await browser.close(); }
