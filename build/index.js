import { Generator } from './gen.js';
import { app } from './global.js';
import targets from './targets.json' with { type: "json" };
import { Translation } from './transation.js';
let targetsany = targets;
let appany = app;
let t = targetsany.targets[appany?.app?.target];
console.log("t", t.translationmap);
const translation = new Translation(t.translationmap);
//new Generator().generate("./build/flutter/lib/main.dart", app); 
if (!t)
    console.log("Error: - no target specified -");
else
    new Generator().generate(t, app, translation);
//# sourceMappingURL=index.js.map