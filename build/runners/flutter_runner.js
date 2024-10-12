import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'node:path';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
console.log("running.. cleaning build");
let child = spawnSync('flutter', ['clean'], { cwd: './build/flutter' });
console.log("running.. starting web");
spawnSync('flutter', ['build', 'web', '--web-renderer=html', '--pwa-strategy=none'], { cwd: './build/flutter' });
let child2 = spawn('flutter', ['run', '-d', 'chrome'], { cwd: './build/flutter', detached: true, stdio: ['ignore', 'ignore', 'ignore'] });
child2.unref();
console.log("rebuild web..");
//# sourceMappingURL=flutter_runner.js.map