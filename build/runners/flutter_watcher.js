import { exec, spawn, spawnSync } from 'node:child_process';
import { openSync, watchFile } from 'fs';
import { fileURLToPath } from 'url';
import path from 'node:path';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
class Processes {
    static find(name) {
        return new Promise((res, rej) => {
            exec("ps -A", (err, stdout, stderr) => {
                res(stdout.toLowerCase().indexOf(name.toLowerCase()) > -1);
            });
        });
    }
}
var out = openSync('./out.log', 'a');
var err = openSync('./out.log', 'a');
// check to see if the watcher is already running..
if (!await Processes.find("fluttermac_watcher.js")) {
    console.log("starting a new watcher...");
    let child = spawn('node', ['fluttermac_watcher.js'], { cwd: './build/runner', detached: true, stdio: ['ignore', out, err] });
    child.unref();
}
else {
    console.log("starting the watcher");
    // let child = spawnSync('flutter', ['clean'], { cwd:'./build/flutter'})  
    //  console.log("running.. starting web")
    let child2 = spawnSync('flutter', ['run', '-d', 'chrome'], { cwd: './build/flutter' });
    console.log("rebuild web..");
    watchFile("./build/flutter/lib/main.dart", () => {
        if (child2) {
            console.log("start hot reload on file change");
            // child.stdin.write("R") // hot reload
            let child2 = spawnSync('flutter', ['run', '-d', 'chrome'], { cwd: './build/flutter' });
        }
    });
}
//# sourceMappingURL=flutter_watcher.js.map