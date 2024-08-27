import { Generator } from './gen.js';
import { appDec, app } from './global.js';
import targets  from './targets.json' with { type:"json"};

let targetsany = targets as any;
let appany:any = app;
let t  = targetsany.targets[appany?.app?.target];

//new Generator().generate("./build/flutter/lib/main.dart", app); 
if (!t) console.log("Error: - no target specified -")
else new Generator().generate(t, app); 

