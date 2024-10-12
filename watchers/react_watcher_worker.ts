import { spawn } from 'node:child_process';

let child = spawn('lite-server', [], { cwd:"../react", detached: true, stdio: [ 'ignore', 'ignore', 'ignore'] });
child.unref();

