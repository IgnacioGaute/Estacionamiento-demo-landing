/** Monta voz, música lo-fi y apertura de marca sobre un recorrido existente. */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const name = process.argv[2];
const durations = { cobro: 197, tarifas: 319.5, caja: 179, administracion: 496.5, inquilinos: 657.28 };
if (!name || !(name in durations)) throw new Error('Uso: node scripts/mezclar-tutoriales.mjs cobro|tarifas|caja|administracion|inquilinos');
const ffmpeg = join(root, '.revision/ffmpeg-tools/node_modules/ffmpeg-static/ffmpeg.exe');
const folder = join(root, '.revision/sonorizacion', name);
const script = JSON.parse(readFileSync(join(folder, 'guion.json'), 'utf8'));
const source = name === 'inquilinos'
  ? join(root, '.revision/tutoriales/inquilinos-v3.webm')
  : join(root, 'public/videos', `${name}-real.webm`);
const intro = join(root, 'public/video-posters', `intro-${name}.png`);
const target = join(root, 'public/videos', `${name}-con-audio.mp4`);
const music = join(root, '.revision/sonorizacion/lofi-original.wav');
const introSeconds = 3.5;
const trimStart = Math.max(0, script[0].start - 2);
const sampleRate = 48000;
mkdirSync(folder, { recursive: true });

function run(args, maxBuffer = 20 * 1024 * 1024) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', ...args], { maxBuffer });
  if (result.status !== 0) throw new Error(result.stderr.toString() || `ffmpeg terminó con ${result.status}`);
  return result.stdout;
}

function writeWav(path, samples) {
  const output = Buffer.allocUnsafe(44 + samples.length * 2);
  output.write('RIFF', 0);
  output.writeUInt32LE(output.length - 8, 4);
  output.write('WAVEfmt ', 8);
  output.writeUInt32LE(16, 16);
  output.writeUInt16LE(1, 20);
  output.writeUInt16LE(1, 22);
  output.writeUInt32LE(sampleRate, 24);
  output.writeUInt32LE(sampleRate * 2, 28);
  output.writeUInt16LE(2, 32);
  output.writeUInt16LE(16, 34);
  output.write('data', 36);
  output.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) output.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  writeFileSync(path, output);
}

const segments = [];
let total = introSeconds + script[0].start - trimStart;
for (let index = 0; index < script.length; index++) {
  const item = script[index];
  const end = index + 1 < script.length ? script[index + 1].start : durations[name];
  const pcm = run(['-i', join(folder, `voz-${String(item.number).padStart(2, '0')}.mp3`), '-f', 'f32le', '-ac', '1', '-ar', String(sampleRate), 'pipe:1']);
  const voice = new Float32Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.byteLength));
  const original = end - item.start;
  const adjusted = Math.max(original, voice.length / sampleRate + 1.05);
  if (adjusted > original + 0.2) console.log(`Cartel ${item.number}: ${original.toFixed(1)}s → ${adjusted.toFixed(1)}s`);
  segments.push({ ...item, end, original, adjusted, ratio: adjusted / original, voice, outputStart: total });
  total += adjusted;
}
const narration = new Float32Array(Math.ceil((total + 0.2) * sampleRate));
for (const segment of segments) {
  const first = Math.round((segment.outputStart + 0.3) * sampleRate);
  for (let index = 0; index < segment.voice.length; index++) {
    const fade = Math.min(1, index / (sampleRate * 0.06), (segment.voice.length - index - 1) / (sampleRate * 0.09));
    narration[first + index] += segment.voice[index] * Math.max(0, fade);
  }
  delete segment.voice;
}
const narrationPath = join(folder, 'narracion-completa.wav');
writeWav(narrationPath, narration);
writeFileSync(join(folder, 'tiempos-finales.json'), JSON.stringify(segments, null, 2));
const originalMusic = readFileSync(music);
const musicData = originalMusic.subarray(44);
const musicBytes = Math.ceil((total + 0.5) * 22050) * 2;
const repeatedMusic = Buffer.allocUnsafe(44 + musicBytes);
originalMusic.copy(repeatedMusic, 0, 0, 44);
repeatedMusic.writeUInt32LE(repeatedMusic.length - 8, 4);
repeatedMusic.writeUInt32LE(musicBytes, 40);
for (let offset = 0; offset < musicBytes; offset += musicData.length) {
  musicData.copy(repeatedMusic, 44 + offset, 0, Math.min(musicData.length, musicBytes - offset));
}
const musicPath = join(folder, 'lofi-completa.wav');
writeFileSync(musicPath, repeatedMusic);

// f(t) suma el tiempo extra a medida que cada cartel se alarga. Una sola pasada
// conserva los clics, el scroll y las transiciones originales entre carteles.
const extension = segments.filter(segment => segment.ratio > 1.001).map(segment => {
  const s = segment.start.toFixed(3);
  const e = segment.end.toFixed(3);
  const extra = (segment.ratio - 1).toFixed(6);
  return `+${extra}*((T-${s}+abs(T-${s}))/2-(T-${e}+abs(T-${e}))/2)`;
}).join('');
const position = `(T-${trimStart.toFixed(3)}${extension})/TB`;
console.log(`${name}: ${durations[name].toFixed(1)}s de imagen → ${total.toFixed(1)}s con apertura y voz`);
async function exportStage(label, args) {
  console.log(name, label);
  await new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-stats_period', '5', '-progress', 'pipe:1', '-y', ...args], { windowsHide: true });
    let stderr = '';
    let progress = '';
    child.stdout.on('data', data => {
      progress += data.toString();
      const lines = progress.split('\n');
      progress = lines.pop();
      for (const line of lines) if (line.startsWith('out_time=')) console.log(name, label, line.slice(9));
    });
    child.stderr.on('data', data => { stderr += data.toString(); });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error(stderr || `ffmpeg terminó con ${code}`)));
  });
}
const introVideo = join(folder, 'apertura.mp4');
const bodyVideo = join(folder, 'pantallas.mp4');
const silentVideo = join(folder, 'imagen-completa.mp4');
const mixedAudio = join(folder, 'audio-completo.m4a');
await exportStage('apertura', ['-loop', '1', '-framerate', '25', '-t', String(introSeconds), '-i', intro,
  '-vf', 'format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-threads', '4', introVideo]);
await exportStage('pantallas', ['-i', source,
  '-vf', `trim=start=${trimStart},setpts=${position},fps=25,tpad=stop_mode=clone:stop_duration=4,format=yuv420p`,
  '-t', (total - introSeconds).toFixed(3), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-threads', '4', bodyVideo]);
const concatPath = join(folder, 'partes-mp4.txt');
writeFileSync(concatPath, `file 'apertura.mp4'\nfile 'pantallas.mp4'\n`);
await exportStage('imagen', ['-f', 'concat', '-safe', '0', '-i', concatPath, '-c', 'copy', silentVideo]);
await exportStage('audio', ['-i', narrationPath, '-i', musicPath,
  '-filter_complex', '[0:a]highpass=f=80,acompressor=threshold=-21dB:ratio=2:attack=12:release=180,loudnorm=I=-17:TP=-2:LRA=9[voice];[1:a]lowpass=f=7200,loudnorm=I=-31:TP=-8:LRA=4[bed];[voice][bed]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.82:level=0[a]',
  '-map', '[a]', '-t', total.toFixed(3), '-c:a', 'aac', '-b:a', '160k', mixedAudio]);
await exportStage('final', ['-i', silentVideo, '-i', mixedAudio, '-map', '0:v', '-map', '1:a',
  '-c', 'copy', '-shortest', '-movflags', '+faststart', target]);
console.log('Listo:', target);
