/** Agrega la misma apertura al primer video, que ya tiene audio aprobado. */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const ffmpeg = join(root, '.revision/ffmpeg-tools/node_modules/ffmpeg-static/ffmpeg.exe');
const folder = join(root, '.revision/sonorizacion/operacion-final');
const intro = join(root, 'public/video-posters/intro-operacion.png');
const source = join(root, 'public/videos/operacion-con-audio.mp4');
const music = join(root, '.revision/sonorizacion/lofi-original.wav');
const target = join(root, 'public/videos/operacion-final.mp4');
mkdirSync(folder, { recursive: true });
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr.toString() || `ffmpeg terminó con ${result.status}`);
}
const introVideo = join(folder, 'apertura.mp4');
const bodyVideo = join(folder, 'pantallas.mp4');
const silentVideo = join(folder, 'imagen-completa.mp4');
const audio = join(folder, 'audio-completo.m4a');
run(['-loop', '1', '-framerate', '25', '-t', '3.5', '-i', intro,
  '-vf', 'format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-threads', '4', introVideo]);
run(['-i', source, '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-threads', '4', bodyVideo]);
const concatPath = join(folder, 'partes-mp4.txt');
writeFileSync(concatPath, "file 'apertura.mp4'\nfile 'pantallas.mp4'\n");
run(['-f', 'concat', '-safe', '0', '-i', concatPath, '-c', 'copy', silentVideo]);
run(['-i', music, '-i', source,
  '-filter_complex', '[0:a]atrim=duration=3.5,asetpts=PTS-STARTPTS,volume=0.6,afade=t=in:st=0:d=1,aresample=48000[opening];[1:a]aresample=48000,asetpts=PTS-STARTPTS[lesson];[opening][lesson]concat=n=2:v=0:a=1,alimiter=limit=0.82:level=0[a]',
  '-map', '[a]', '-c:a', 'aac', '-b:a', '160k', audio]);
run(['-i', silentVideo, '-i', audio, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-shortest', '-movflags', '+faststart', target]);
console.log('Listo:', target);
