import { exec, spawn, spawnSync } from 'node:child_process';
import { read, readFileSync, openSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'node:path';


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

class Processes {
  static find(name:String) : Promise<Boolean> {
    return new Promise((res, rej) => {
      exec("ps -A", (err, stdout, stderr) => {
        res(stdout.toLowerCase().indexOf(name.toLowerCase()) > -1);
    });
    })
  }
}
var out = openSync('./out.log', 'a');
var err = openSync('./out.log', 'a');

// check to see if the watcher is already running..
if (! await Processes.find("fluttermac_watcher.js")) {
  let child = spawn('node', ['fluttermac_watcher.js'], { cwd:'./build/runner', detached: true, stdio: [ 'ignore', out, err] });
  child.unref();
} else {
}


