import { exec, spawn, spawnSync } from 'node:child_process';
import { read, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'node:path';

// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename);

// console.log("current working dir", process.cwd())


// exec(`node ${__dirname}/fluttermac_watcher.js`, function(error, stdout, stderr){
//   console.log(error);
//   console.log(stderr);
//   console.log(stdout);
// });

// // let child = spawn('node', ['fluttermac_watcher'], { cwd:'./build/runner', detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] });
// // child.unref();

console.log("listening to file changes");
