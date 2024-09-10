import { Translation } from './transation.js'

let globaltranslation:Translation|undefined = undefined;

export interface IRenderable {
    children:IRenderable[];
    render(level:string, template:String, setupmarker:String, localmarker:String) : Promise<String>; 
    renderDeclaration() : Promise<String>; 
    renderGlobalScope() : Promise<String>; 
    renderLocalScope() : Promise<String>; 
    renderSetupScope() : Promise<String>; 
    renderImportScope(): Promise<String>;
}

export class Renderable implements IRenderable {
    id:any
    level:string = ''

    children:IRenderable[] = []
    constructor(id:any, state:any){
        this.id = id;
        this.fromState(state);
    }
    fromState(s:Object)  {
        for (let p of Object.keys(s)) {
            if (p == "children") {
                for (let c of (s as any)[p]) {
                    let r = RenderWidget.fromObject(c)
                    if (r)
                        this.children.push(r)
                }
            }
            else {
                (this as any)[p] = (s as any)[p]; 
            }
        }
    }
    parseResult(result:string):string {
    if (result) {
        let me:any = this;
       for (let k of Object.keys(me)) {
         console.log("replacing", k, me[k])
         result = result.replaceAll(`[[${k}]]`, me[k])
       }  
     }
     return result;
    }
    async render(level:string, template:string, setupmarker:string, localmarker:string): Promise<String> {
       
        let me:any = this;
        let lsp = localmarker
        let sup = setupmarker

        this.level = level + ".";

       // template = template.replaceAll(ls, lsp).replaceAll(su, sup)

        let localcode = await this.renderLocalScope()
        let setupcode = await this.renderSetupScope(); 

        // find the nearest marker and paste the code 
        for (let i = level.length; i > 0; i--) {
             let placeholder = `{ /* [[${'.'.repeat(i)}local]] */ }`
             if (template.indexOf(placeholder) > -1) {
                template = template.replaceAll(`${placeholder}`, `${placeholder} \n ${localcode}`)
                break
             }
        }

        for (let i = level.length; i > 0; i--) {
            let placeholder = `{ /* [[${'.'.repeat(i)}local]] */ }`
            if (template.indexOf(placeholder) > -1) {
               template = template.replaceAll(`${setupmarker}`, `${setupmarker} \n ${setupcode}`)
               break
            }
       }
        
        if (me.children) {
            for (let c of me.children) {
                template = await c.render(this.level, template, sup, lsp) 
            }
        }
        return template;//.replaceAll(sup, "").replaceAll(lsp, "")
    }

    async renderLocalScope(): Promise<String> {
       return await this._renderScope("execution")
     }

     async renderDeclaration(): Promise<String> {
        return await this._renderScope("declaration")
     }
     async renderGlobalScope(): Promise<String> {
        return await this._renderScope("global")
     }
      
     async renderSetupScope(): Promise<String> {
       return await this._renderScope("setup")
    }

    async renderImportScope(): Promise<String> {
        return await this._renderScope("imports")
     }

    async _renderScope(scope:String){

       

        let result =  await globaltranslation!.getTemplate(this.constructor.name.toLowerCase(),scope);
        if (!result) return ""
        let template = this.parseResult(result);

        let lsp = `{ /* [[local]] */ }`
        let sup = `{ /* [[setup]] */ }`
        let ulsp = `{ /* [[${this.level}local]] */ }`
        let usup = `{ /* [[${this.level}setup]] */ }`
        template = template.replaceAll(lsp, ulsp).replaceAll(sup, usup);

        let me:any = this;
        let statements = "";
        if (me.source) {
            statements = this._renderStatements("source", [me.source], undefined);
        }
        template = template.replaceAll(`##SOURCE##`, statements)
        
        statements = "";
        if (me.triggers) {
            let triggers = me.triggers.split(",")
            console.log("triggers:", triggers);
            statements = this._renderStatements("trigger", triggers, me.action || me.label)
        }        
        template = template.replaceAll(`##TRIGGERS##`, statements)
        return template;
    }

    _renderStatements(target:String, placeholders:String[], action:String|undefined) {
        let statements = "";
        if (target == "trigger")
           // let params = null;
            for (let t of placeholders) {
                statements += `datasource${t}.${action || 'refresh'}(event);\n`
            }

        if (target == "source")
            for (let t of placeholders) {
                statements += `datasource${t}.${action || 'getValue'}()\n`
            }
        statements = statements + ""
        return statements;
    }
}



export class RenderWidget {
   

    static findTreeElement(id:string, r:any):any{
        let element = null;
        for (let c of r.children){
            if (c.id == id) return c;
            element = this.findTreeElement(id, c);
            if (element) return element;
        }
        return element;
    }

    static generateClass(classname:String): any {
        return eval(`
            (class ${classname} extends ${Renderable} {
                constructor(id, s){
                    super(id, s); 
                }
        })
   `)
    }
    static fromObject(o:Object): IRenderable | null {
        let classname = Object.keys(o)[0];
        let target = Object.values(o)[0];
        let ctor = RenderWidget.generateClass(classname); 
        if (!ctor) ctor = Renderable;
        console.log("o", target.id);  
        let tree =  ctor ? new ctor(target.id, target) as IRenderable : null
        return tree;
    }


    static async render(target:any, root:Renderable, translation:Translation):Promise<string>{
        return this._render(target, root, translation); 
    }

    static async _collectImportLines(root:Renderable, lines:String[]) {
        lines.push(await root.renderImportScope());
        if (root.children) {
            for(let c of root.children){
                await this._collectImportLines(c as Renderable, lines); 
            }
        }
    }

    static async _collectDeclarationLines(root:Renderable, lines:String[]) {
        lines.push(await root.renderDeclaration());
        if (root.children) {
            for(let c of root.children){
                await this._collectDeclarationLines(c as Renderable, lines); 
            }
        }
    }

    static async _collectGlobalLines(root:Renderable, lines:String[]) {
        lines.push(await root.renderGlobalScope());
        if (root.children) {
            for(let c of root.children){
                await this._collectGlobalLines(c as Renderable, lines); 
            }
        }
    }

    static async _render(target:any, root:Renderable, translation:Translation):Promise<string>{
       //return import(`./translationmap.${target.translationmap}.js`).then(m => {
        //    translationmap = m.translationmap;
           // let template = translationmap.get("root")?.template
            globaltranslation = translation;
            let template = await translation.getTemplate("root")

            // mark the local and setup scopes, make them unique for this scope
            let lsp = `{ /* [[local]] */ }`
            let sup = `{ /* [[setup]] */ }`

            let level = "."
            let ulsp = `{ /* [[${level}local]] */ }`
            let usup = `{ /* [[${level}setup]] */ }`
            template = template.replaceAll(lsp, ulsp).replaceAll(sup, usup);

            if (!template) return "-- error -- missing template"
            let gs = '// [[global]]'
            let imports = '// [[imports]]'

            template = root.parseResult(template)
            

            // walk the tree and render the global section
            let importlines:any[] = [];
            await this._collectImportLines(root, importlines); 
            template = template.replaceAll(`${imports}`, `${imports} \n ${importlines.join('\n')}`)

            let globallines:any[] = [];
            await this._collectGlobalLines(root, globallines); 
            template = template.replaceAll(`${gs}`, `${gs} \n ${globallines.join('\n')}`)

            let declarationlines:any[] = [];
            await this._collectDeclarationLines(root, declarationlines); 
            template = template.replaceAll(`${gs}`, `${gs} \n ${declarationlines.join('\n')}`)

            
            // template = template.replaceAll(ls, lsp).replaceAll(su, sup)
            template = await root.render(level, template, sup, lsp);
            // let localcode = await root.renderLocalScope()
            // let setupcode = await root.renderSetupScope(); 
            
            // template = template.replaceAll(`${lsp}`, `${lsp} \n ${localcode}`)
            // template = template.replaceAll(`${sup}`, `${sup} \n ${setupcode}`)
            
            
            console.log("template before walk", template)
            // walk the tree and render the global section
            // for (let c of root.children)
            //   template = await c.render(level, template, sup, lsp);

            console.log("template after walk", template)

            // let l = ""; 
            // for (let c of root.children) {
            //     l += await c.renderLocalScope() 
            // }
            // template = template.replaceAll(`${ls}`, `${ls} \n ${l}`)

            // // walk the tree and render the global section
            // let s = ""; 
            // for (let c of root.children) {
            //     s += await c.renderSetupScope() 
            // }
            // template = template.replaceAll(`${su}`, `${su} \n ${s}`)
          console.log("template", template); 
            return template.replaceAll(gs, "").replaceAll(imports, "").replaceAll(usup, "").replaceAll(ulsp, "")
       // });
    }
}