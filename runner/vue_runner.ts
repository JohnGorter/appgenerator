import { spawn } from 'node:child_process';
import * as fs from 'node:fs';

console.log("current working dir", process.cwd())
console.log("spawning vue lite server")
let child = spawn('lite-server', [], { cwd:'./build/vue'})  

child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

// console.log("listening to file changes");
