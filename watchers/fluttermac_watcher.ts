import { spawn, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import JGen from '../index.js';

let child = spawn('flutter', ['run', '-d', 'macos'], { cwd:'../flutter'})  

fs.watchFile("./build/flutter/lib/main.dart", () => {
  if (child) {
    child.stdin.write("R") // hot reload
  }
}
);

child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

