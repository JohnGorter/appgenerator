import { appDec } from "./global.js"
import  * as fs  from 'fs'
import { IRenderable, RenderWidget  } from "./ast.js";


export class Generator {
    #app:any = {};

   async generate(target:any, app:appDec){
      this.#app = app;
      fs.writeFileSync(target.output, await this.#_generateCode(target, this.#_loadComponents()))  
    }

    #_loadComponents(){
        return RenderWidget.fromObject(this.#app) 
    }

    async #_generateCode(target:any, tree:any)
    {
        return await RenderWidget.render(target, tree) || "";
    }
}