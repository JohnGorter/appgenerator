import { spawn } from 'node:child_process';
import { watchFile} from 'fs';

// check to see if the watcher is already running..
let child2= spawn('flutter', ['run', '-d', 'chrome'], { cwd:'../flutter'})  
child2.on('exit', () => { process.exit() })
watchFile("../flutter/lib/main.dart", () => {
  if (child2) {
      child2.stdin.write("R") // hot reload
  }
});


