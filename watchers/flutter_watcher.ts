import { exec, spawn } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

class Processes {
  static find(name:String) : Promise<Boolean> {
    return new Promise((res, _) => {
      exec("ps -A", (_, stdout, __) => {
        res(stdout.toLowerCase().indexOf(name.toLowerCase()) > -1);
    });
    })
  }
}
// check to see if the watcher is already running..
if (!await Processes.find("flutter_watcher_worker.js")) {
    let child = spawn('node', ['flutter_watcher_worker.js'], { cwd: __dirname, detached: true, stdio: [ 'ignore', 'ignore', 'ignore'] });
    child.unref();
}
process.exit();

