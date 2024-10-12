import { spawn } from 'node:child_process';
import * as fs from 'node:fs';

let child = spawn('lite-server', [], { cwd:'./build/react'})  

child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

// console.log("listening to file changes");
