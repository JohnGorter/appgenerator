import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
console.log("current  dir", process.cwd());
let child = spawn('flutter', ['run', '-d', 'macos'], { cwd: '../flutter' });
fs.watchFile("./build/flutter/lib/main.dart", () => {
    if (child) {
        console.log("start hot reload on file change");
        child.stdin.write("R"); // hot reload
        //let child = spawn('flutter', ['build', 'web'], { cwd:'./build/flutter'})  
    }
});
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
console.log("listening to file changes");
//# sourceMappingURL=fluttermac_watcher.js.map