import { exec, spawn } from 'node:child_process';
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
// check to see if the watcher is already running..
if (!await Processes.find("lite-server")) {
    let child = spawn('node', ['react_watcher_worker.js'], { cwd: __dirname, detached: true, stdio: ['ignore', 'ignore', 'ignore'] });
    child.unref();
}
process.exit();
//# sourceMappingURL=react_watcher.js.map