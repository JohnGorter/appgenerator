import { spawn } from 'node:child_process';
let child = spawn('lite-server', [], { cwd: './build/vue' });
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
// console.log("listening to file changes");
//# sourceMappingURL=vue_runner.js.map