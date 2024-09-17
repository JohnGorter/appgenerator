import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
let child = spawn('flutter', ['run', '-d', 'macos'], { cwd: "./build/flutter" });
fs.watchFile("./build/flutter/lib/main.dart", () => {
    if (child) {
        console.log("start hot reload on file change");
        child.stdin.write("R"); // hot reload
    }
});
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
console.log("listening to file changes");
//# sourceMappingURL=flutter_runner.js.map