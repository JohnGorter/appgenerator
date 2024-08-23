import { appDec } from "./global.js"
import  * as fs  from 'fs'
import { IRenderable, RenderWidget  } from "./ast.js";


export class Generator {
    #app:Object = {};

    generate(location:string, app:appDec){
      this.#app = app
      fs.writeFileSync(location, this.#_generateCode(this.#_loadComponents()))  
    }

    #_loadComponents(){
        return RenderWidget.fromObject(this.#app) 
    }

    #_generateCode(tree:any)
    {
        return RenderWidget.render(tree) 
    }
}