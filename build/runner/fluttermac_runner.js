import { exec, spawn } from 'node:child_process';
import { openSync } from 'fs';
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
console.log("current working dir", process.cwd());
var out = openSync('./out.log', 'a');
var err = openSync('./out.log', 'a');
// check to see if the watcher is already running..
if (!await Processes.find("fluttermac_watcher.js")) {
    console.log("starting the watcher");
    let child = spawn('node', ['fluttermac_watcher.js'], { cwd: './build/runner', detached: true, stdio: ['ignore', out, err] });
    child.unref();
}
else {
    console.log("do nothing: the watcher already runs");
}
console.log("listening to file changes");
//# sourceMappingURL=fluttermac_runner.js.map