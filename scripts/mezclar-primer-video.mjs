/**
 * Estira las escenas para que entre la voz y mezcla una base lo-fi original.
 * Ejecutar después de sonorizar-primer-video.py.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const tmp = join(root, '.revision', 'sonorizacion');
const ffmpeg = join(root, '.revision', 'ffmpeg-tools', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const source = join(root, 'public', 'videos', 'operacion-real.webm');
const target = join(root, 'public', 'videos', 'operacion-con-audio.webm');
mkdirSync(tmp, { recursive: true });

function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', ...args], { maxBuffer: 32 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`ffmpeg ${args.slice(-2).join(' ')}: ${result.stderr.toString()}`);
  return result.stdout;
}

// Inicio y fin medidos sobre los carteles del video original (25 fps).
const spans = [
  [0, 2, 0], [2, 8, 1], [8, 14, 2], [14, 22, 3], [22, 29, 4],
  [29, 35, 5], [35, 41, 6], [41, 52, 7], [52, 59, 8],
  [59, 65, 9], [65, 73, 10], [73, 83.5, 11], [83.5, 89, 0],
  [89, 95, 12], [95, 104, 13], [104, 113, 14], [113, 127, 15],
  [131, 139.6, 16],
];

const voiceRate = 48000;
const voiceClips = new Map();
for (let number = 1; number <= 16; number++) {
  const mp3 = join(tmp, `voz-${String(number).padStart(2, '0')}.mp3`);
  const pcm = run(['-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', String(voiceRate), 'pipe:1']);
  const data = new Float32Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.byteLength));
  voiceClips.set(number, data);
}

const timeline = [];
let cursor = 0;
for (let index = 0; index < spans.length; index++) {
  const [start, end, number] = spans[index];
  const original = end - start;
  const spoken = number ? voiceClips.get(number).length / voiceRate : 0;
  const duration = number ? Math.max(original * 1.04, spoken + 1.25) : original;
  timeline.push({ index, start, end, number, original, spoken, duration, outputStart: cursor });
  cursor += duration;
}
writeFileSync(join(tmp, 'tiempos.json'), JSON.stringify(timeline, null, 2));
console.log('Duración original:', spans.at(-1)[1], 'segundos. Con narración:', cursor.toFixed(1), 'segundos.');

function writeWav(path, samples, sampleRate) {
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

const narration = new Float32Array(Math.ceil((cursor + 0.5) * voiceRate));
for (const span of timeline) {
  if (!span.number) continue;
  const clip = voiceClips.get(span.number);
  const first = Math.round((span.outputStart + 0.3) * voiceRate);
  for (let i = 0; i < clip.length; i++) {
    const fade = Math.min(1, i / (voiceRate * 0.06), (clip.length - 1 - i) / (voiceRate * 0.09));
    narration[first + i] += clip[i] * Math.max(0, fade);
  }
}
writeWav(join(tmp, 'narracion.wav'), narration, voiceRate);

// Música instrumental original: acordes Rhodes suaves, bajo, batería cepillada y ruido de cinta.
const musicRate = 22050;
const music = new Float32Array(Math.ceil((cursor + 0.5) * musicRate));
let seed = 381117;
function noise() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 0xffffffff * 2 - 1; }
function addTone(at, seconds, hz, amplitude, mode = 'keys') {
  const from = Math.round(at * musicRate);
  const count = Math.min(Math.round(seconds * musicRate), music.length - from);
  if (from < 0 || count <= 0) return;
  for (let i = 0; i < count; i++) {
    const t = i / musicRate;
    const attack = Math.min(1, t * (mode === 'keys' ? 45 : 100));
    const decay = Math.exp(-t * (mode === 'keys' ? 0.45 : 1.8));
    const wobble = mode === 'keys' ? 1 + Math.sin(2 * Math.PI * 0.8 * t) * 0.0015 : 1;
    const phase = 2 * Math.PI * hz * t * wobble;
    const tone = mode === 'keys'
      ? Math.sin(phase) + 0.18 * Math.sin(phase * 2) + 0.045 * Math.sin(phase * 3)
      : Math.sin(phase) + 0.12 * Math.sin(phase * 2);
    music[from + i] += tone * amplitude * attack * decay;
  }
}
function kick(at) {
  const from = Math.round(at * musicRate);
  for (let i = 0; i < musicRate * 0.32 && from + i < music.length; i++) {
    const t = i / musicRate;
    const phase = 2 * Math.PI * (48 * t + 42 * (1 - Math.exp(-t * 28)) / 28);
    music[from + i] += 0.09 * Math.sin(phase) * Math.exp(-t * 15);
  }
}
function snare(at) {
  const from = Math.round(at * musicRate);
  let previous = 0;
  for (let i = 0; i < musicRate * 0.18 && from + i < music.length; i++) {
    const t = i / musicRate;
    const white = noise();
    music[from + i] += ((white - previous * 0.72) * 0.014 + 0.006 * Math.sin(2 * Math.PI * 165 * t)) * Math.exp(-t * 22);
    previous = white;
  }
}
function hat(at, strength) {
  const from = Math.round(at * musicRate);
  let previous = 0;
  for (let i = 0; i < musicRate * 0.09 && from + i < music.length; i++) {
    const t = i / musicRate;
    const white = noise();
    music[from + i] += (white - previous) * strength * Math.exp(-t * 65);
    previous = white;
  }
}

const beat = 60 / 76;
const chords = [
  { notes: [174.61, 220, 261.63, 329.63], root: 87.31, fifth: 130.81 },
  { notes: [164.81, 196, 246.94, 329.63], root: 82.41, fifth: 123.47 },
  { notes: [146.83, 174.61, 220, 261.63], root: 73.42, fifth: 110 },
  { notes: [146.83, 196, 246.94, 329.63], root: 98, fifth: 146.83 },
];
for (let bar = 0; bar * beat * 4 < cursor; bar++) {
  const at = bar * beat * 4;
  const chord = chords[bar % chords.length];
  for (const hz of chord.notes) {
    addTone(at, beat * 3.8, hz, 0.023, 'keys');
    addTone(at + beat * 2, beat * 1.8, hz, 0.008, 'keys');
  }
  addTone(at, beat * 1.7, chord.root, 0.067, 'bass');
  addTone(at + beat * 2, beat * 1.5, chord.fifth, 0.038, 'bass');
  for (let b = 0; b < 4; b++) {
    const current = at + b * beat;
    if (b % 2 === 0) kick(current);
    else snare(current);
    hat(current, 0.0045);
    hat(current + beat / 2, 0.003);
  }
}
let hiss = 0;
for (let i = 0; i < music.length; i++) {
  hiss = hiss * 0.9 + noise() * 0.1;
  const seconds = i / musicRate;
  const fade = Math.min(1, seconds / 1.8, (cursor - seconds) / 2.7);
  music[i] = (music[i] + hiss * 0.0012) * Math.max(0, fade);
}
writeWav(join(tmp, 'lofi-original.wav'), music, musicRate);

const partNames = [];
for (const span of timeline) {
  const name = `parte-${String(span.index).padStart(2, '0')}.webm`;
  const path = join(tmp, name);
  const ratio = span.duration / span.original;
  run(['-y', '-ss', String(span.start), '-t', String(span.original), '-i', source,
    '-vf', `setpts=${ratio.toFixed(6)}*(PTS-STARTPTS),fps=25`, '-an',
    '-c:v', 'libvpx', '-b:v', '1300k', '-deadline', 'realtime', '-cpu-used', '5', '-threads', '4', path]);
  partNames.push(name);
  console.log(`Escena ${span.number || 'transición'}: ${span.original.toFixed(1)}s → ${span.duration.toFixed(1)}s`);
}
const concatFile = join(tmp, 'partes.txt');
writeFileSync(concatFile, partNames.map(name => `file '${name}'`).join('\n') + '\n');
const stretched = join(tmp, 'video-extendido.webm');
run(['-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy', stretched]);
run(['-y', '-i', stretched, '-i', join(tmp, 'narracion.wav'), '-i', join(tmp, 'lofi-original.wav'),
  '-filter_complex', '[1:a]highpass=f=80,acompressor=threshold=-21dB:ratio=2:attack=12:release=180,loudnorm=I=-17:TP=-2:LRA=9[v];[2:a]lowpass=f=7200,loudnorm=I=-31:TP=-8:LRA=4[m];[v][m]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.82:level=0[a]',
  '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'libopus', '-b:a', '128k', '-shortest', target]);
const mobileTarget = join(root, 'public', 'videos', 'operacion-con-audio.mp4');
run(['-y', '-i', target, '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', mobileTarget]);
console.log('Preview con voz y música:', target);
