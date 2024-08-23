import { Generator } from './gen.js';
import { appDec, app } from './global.js';

new Generator().generate("./build/react/index.js", app); 

