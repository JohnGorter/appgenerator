import { spawn, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import JGen from '../index.js';
import path from 'path';

console.log("current working dir", process.cwd())
//let child = spawn('flutter', ['run', '-d', 'chrome'], { cwd:'./build/flutter'})  
console.log("cleaning the build folder")
let child = spawnSync('flutter', ['clean'], { cwd:'./build/flutter'})  
console.log("rebuilding the build folder")

let child2= spawnSync('flutter', ['build', 'web', '--web-renderer=html', '--pwa-strategy=none'], { cwd:'./build/flutter'})  
console.log("done")


// fs.watchFile("./build/flutter/lib/main.dart", () => {
//   if (child) {
//    console.log("start hot reload on file change")
//    // child.stdin.write("R") // hot reload
//    let child = spawn('flutter', ['build', 'web'], { cwd:'./build/flutter'})  

//   }
// }
// );

// child.stdout.pipe(process.stdout)
// child.stderr.pipe(process.stderr)

// console.log("listening to file changes");
