import * as fs from 'fs';
import { RenderWidget } from "./ast.js";
import { appDec } from "./global.js";
import { Translation } from "./translation/translation.js";


export class Generator {
    #app:any = {};

   async generate(target:any, app:appDec, translation:Translation ){
      this.#app = app;
      fs.writeFileSync(target.output, await this.#_generateCode(target, this.#_loadComponents(), translation))
   }

    #_loadComponents(){
        return RenderWidget.fromObject(this.#app) 
    }

    async #_generateCode(target:any, tree:any, translation:Translation)
    {
        return await RenderWidget.render(target, tree, translation) || "";
    }
}