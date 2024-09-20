import { spawn, spawnSync } from 'child_process';
import * as fs from 'node:fs';
import { Generator } from './gen.js';
import targets from './targets.json' with { type: "json" };
import { Translation } from './translation/translation.js';
import { readFileSync } from 'fs';
export default class JGen {
    restart(file = "./app.json") {
        console.log("reading file", process.cwd() + "/" + file);
        let f = readFileSync(file, 'utf-8');
        // console.log("starting", f)
        let app = JSON.parse(f);
        let targetsany = targets;
        let appany = app;
        let t = targetsany.targets[appany?.app?.target];
        const translation = new Translation(t.translationmap);
        //new Generator().generate("./build/flutter/lib/main.dart", app); 
        if (!t)
            console.log("Error: - no target specified -");
        else
            new Generator().generate(t, app, translation);
    }
    async start(appstring, startRunner = false) {
        // console.log("starting", f)
        let targets = JSON.parse(readFileSync('./targets.json', 'utf-8'));
        let app = JSON.parse(appstring);
        let targetsany = targets;
        let appany = app;
        console.log("targets", targets);
        console.log("target", appany);
        let t = targetsany.targets[appany?.app?.target];
        // console.log("cwd", process.cwd())
        // console.log("spawning runner ->", t.runner)
        if (startRunner) {
            let child = spawn('node', [`./build/runner/${t.runner}`]);
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        }
        // console.log("runner spawned")
        fs.watchFile("./app.json", () => {
            console.log("start  recompilation");
            new JGen().restart();
        });
        // console.log("t", t.translationmap)
        const translation = new Translation(t.translationmap);
        //new Generator().generate("./build/flutter/lib/main.dart", app); 
        if (!t)
            console.log("Error: - no target specified -");
        else {
            await new Generator().generate(t, app, translation);
            console.log("spawning runner");
            let child = spawnSync('node', [`./build/runner/${t.runner}`]);
            console.log("spawning runner, done");
            console.log(child.output.toString());
            // child.stdout.pipe(process.stdout)
            // child.stderr.pipe(process.stderr)
        }
    }
}
//# sourceMappingURL=index.js.map