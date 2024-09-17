import { appDec } from "./global.js"
import  * as fs  from 'fs'
import { spawn } from 'node:child_process'
import { IRenderable, RenderWidget  } from "./ast.js";
import { Translation } from "./transation.js";


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