import { TraceWriter, traceWriter } from './TraceWriter.js';
import { Translation } from './translation/translation.js';

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
    example:string = ""
    level:string = ''

    children:IRenderable[] = []
    constructor(id:any, state:any){
        traceWriter.verbose("Constructing the object", TraceWriter.AREA_TREEBUILDING)
        this.id = id;
        traceWriter.verbose("Copying over the state fron JSON to object", TraceWriter.AREA_TREEBUILDING)
        this.fromState(state);
    }
    fromState(s:Object)  {
        let me:any = this;
        for (let p of Object.keys(s)) {
            if (Array.isArray((s as any)[p])) {
                for (let c of (s as any)[p]) {
                    traceWriter.verbose("Generating object " + c + " as child", TraceWriter.AREA_TREEBUILDING)
                    let r = RenderWidget.fromObject(c)
                    if (r) {
                        me[p] = me[p] || []; 
                        me[p].push(r)
                    }
                }
            }
            else {
                traceWriter.verbose("Adding property " + p + " with value " + (s as any)[p] + " to object", TraceWriter.AREA_TREEBUILDING);
                (this as any)[p] = (s as any)[p]; 
            }
        }
    }
    async parseResult(result:string):Promise<string> {
      let me:any = this;
      for (let k of Object.keys(me)) {
        if (k == "example")  await globaltranslation?.getExample(this.constructor.name).then((example) => this.example = example)
        traceWriter.verbose(`Replacing template placeholder [[${k}]] with value ${me[k]}`, TraceWriter.AREA_CODEGENERATION);
        if (!Array.isArray(me[k]))
        result = result.replaceAll(`[[${k}]]`, me[k])
      }
      return result;
    }
    async render(level:string, template:string, scope:string): Promise<String> {
       
        let me:any = this;
        if (me.constructor.name == "drawer") console.log("drawer template"); 
        this.level = level + ".";
        traceWriter.verbose(`Rendering code for level ${level} with template ${template}`, TraceWriter.AREA_CODEGENERATION);


        //let othercode = await this.renderOtherScope("drawer")

        let localcode = await this.renderLocalScope()
        let setupcode = await this.renderSetupScope(); 

        // find the nearest marker and paste the code 
        if (localcode.length > 0) {
            for (let i = this.level.length; i > 0; i--) {
                let placeholder = `[[${'.'.repeat(i)}${scope}]]`
                traceWriter.verbose(`For ${scope}: Testing for placeholder ${placeholder} in template`, TraceWriter.AREA_CODEGENERATION);
                if (template.indexOf(placeholder) > -1) {
                    traceWriter.verbose(`For localcode: Replacing placeholder ${placeholder} with ${localcode}`, TraceWriter.AREA_CODEGENERATION);
                    template = template.replaceAll(`${placeholder}`, `${localcode}\n${placeholder}`)
                    break
                }
            }
        }

        if (setupcode.length > 0) {
            for (let i = this.level.length; i > 0; i--) {
                let placeholder = `[[${'.'.repeat(i)}setup]]`
                traceWriter.verbose(`For setupcode: Testing for placeholder ${placeholder} in template`, TraceWriter.AREA_CODEGENERATION);
                if (template.indexOf(placeholder) > -1) {
                    traceWriter.verbose(`For setupcode: Replacing placeholder ${placeholder} with ${localcode}`, TraceWriter.AREA_CODEGENERATION);
                    template = template.replaceAll(`${placeholder}`, `${setupcode}\n${placeholder}`)
                    break
                }
            }
        }
        
        for (const arr of Object.keys(me)) {
            if (Array.isArray(me[arr])) {
               for (let c of me[arr]) {
                    traceWriter.verbose(`Rendering child: ${c}`, TraceWriter.AREA_CODEGENERATION);
                    template = await c.render(this.level, template, arr) 
               }
               template = template.replaceAll(`[[${'.'.repeat(this.level.length)}${arr}]]`, ``); 
           
            }
        }

        traceWriter.verbose(`Completed template ${template}`, TraceWriter.AREA_CODEGENERATION);
        return template;
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
     async renderStyleScope(): Promise<String> {
        return await this._renderScope("styles")
     }
      
     async renderSetupScope(): Promise<String> {
       return await this._renderScope("setup")
    }

    async renderImportScope(): Promise<String> {
        return await this._renderScope("imports")
     }

    async _renderScope(scope:String){
        if (scope == "styles") { console.log("scope for styles!", this.constructor.name)};
        traceWriter.verbose(`Rendering scope: ${scope}`, TraceWriter.AREA_CODEGENERATION);
        let config  =  await globaltranslation!.getConfig(this.constructor.name.toLowerCase());
        let result =  await globaltranslation!.getTemplate(this.constructor.name.toLowerCase(),scope);
        if (!result) return ""

        if (scope == "execution" && this.example) result = result + '<pre className="example">{`' + this.example + '`}</pre>' 
        
        traceWriter.verbose(`Config ${config}`, TraceWriter.AREA_CODEGENERATION);
        traceWriter.verbose(`Template ${result} for scope ${scope}`, TraceWriter.AREA_CODEGENERATION);

        let template = await this.parseResult(result);

        let sup = `[[setup]]`
        let usup = `[[${this.level}setup]]`
        template = template.replaceAll(sup, usup);

        for (let arr of Object.keys(this))
            if (Array.isArray((this as any)[arr])) {
                let lsp = `[[${arr}]]`
                let ulsp = `[[${this.level}${arr}]]`
                template = template.replaceAll(lsp, ulsp);
            }

        let me:any = this;
        let statements = "";
        if (me.triggers) {
            let triggers = me.triggers.split(",")
            statements = this._renderStatements("trigger", triggers, me.action || config?.defaultAction || "refresh")
        }        
        template = template.replaceAll(`##TRIGGERS##`, statements)
        if (scope == "styles") console.log("template", template)
        return template;
    }

    _renderStatements(target:String, placeholders:String[], action:String|undefined) {
        let statements = "";
        if (target == "trigger")
           // let params = null;
            for (let t of placeholders) {
                statements += `datasource${t}.${action}(event);\n`
            }

        if (target == "source")
            for (let t of placeholders) {
                statements += `datasource${t}.${action}()\n`
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
        traceWriter.info("Generating a new class for " + classname, TraceWriter.AREA_TREEBUILDING)

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
        traceWriter.info("Creating object from JSON for " + classname, TraceWriter.AREA_TREEBUILDING)
        let target = Object.values(o)[0];
        let ctor = RenderWidget.generateClass(classname); 
        if (!ctor) ctor = Renderable;
        let tree =  ctor ? new ctor(target.id, target) as IRenderable : null
        return tree;
    }

    static async render(target:any, root:Renderable, translation:Translation):Promise<string>{
        traceWriter.info(`Rendering code for ${root.constructor.name}`, TraceWriter.AREA_CODEGENERATION);
        return await this._render(target, root, translation, "children"); 
    }

    static async _collectImportLines(root:Renderable, lines:String[]) {
        let line = await root.renderImportScope();
        let klines = line.split('\n')
        if (klines.length > 0)
            for (let kline of klines) {
                if (!lines.find(l => l == kline)) lines.push(kline);
            }
        for (let arr of Object.keys(root)) {
            if (Array.isArray((root as any)[arr])) {
                for (let c of (root as any)[arr]){
                    await this._collectImportLines(c as Renderable, lines); 
                }
            }
        }
    }

    static async _collectDeclarationLines(root:Renderable, lines:String[]) {
        let line = await root.renderDeclaration();
        if (!lines.find(l => l == line)) lines.push(line);
        for (let arr of Object.keys(root)) {
            if (Array.isArray((root as any)[arr])) {
                for (let c of (root as any)[arr]){
                    await this._collectDeclarationLines(c as Renderable, lines); 
                }
            }
        }
    }

    static async _collectGlobalLines(root:Renderable, lines:String[]) {
        lines.push(await root.renderGlobalScope());
        for (let arr of Object.keys(root)) {
            if (Array.isArray((root as any)[arr])) {
                for (let c of (root as any)[arr]){
                    await this._collectGlobalLines(c as Renderable, lines); 
                }
            }
        }
    }

    static async _collectStyleLines(root:Renderable, lines:String[]) {
        lines.push(await root.renderStyleScope());
        for (let arr of Object.keys(root)) {
            if (Array.isArray((root as any)[arr])) {
                for (let c of (root as any)[arr]){
                    await this._collectStyleLines(c as Renderable, lines); 
                }
            }
        }
    }

    static removeEmptyLines(lines:string[]):string[]{
        let retval = []; 
        for(let l of lines) {
            if (l) retval.push(l)
        }
         return retval; 
    }

    static async _render(target:any, root:Renderable, translation:Translation, scope:string):Promise<string>{
            globaltranslation = translation;
            let template = await translation.getTemplate("root")
            if (!template) return "-- error -- missing template"

            // mark the local and setup scopes, make them unique for this scope
            let lsp = `[[${scope}]]`
            let sup = `[[setup]]`

            let level = "."
            let ulsp = `[[${level}${scope}]]`
            let usup = `[[${level}setup]]`
            template = template.replaceAll(lsp, ulsp).replaceAll(sup, usup);
            
            let gs = '// [[global]]'
            let imports = '// [[imports]]'
            let styles = '// [[styles]]'

            template = await root.parseResult(template)
            

            // walk the tree and render the global section
            let importlines:any[] = [];
            await this._collectImportLines(root, importlines); 
            importlines = this.removeEmptyLines(importlines)
            template = template.replaceAll(`${imports}`, `${imports} \n ${importlines.join('\n')}`)

            let styleLines:any[] = [];
            await this._collectStyleLines(root, styleLines); 
            styleLines = this.removeEmptyLines(styleLines)
            template = template.replaceAll(`${styles}`, `${styles} \n ${styleLines.join('\n')}`)

            let globallines:any[] = [];
            await this._collectGlobalLines(root, globallines); 
            globallines = this.removeEmptyLines(globallines)
            template = template.replaceAll(`${gs}`, `${gs} \n ${globallines.join('\n')}`)

            let declarationlines:any[] = [];
            await this._collectDeclarationLines(root, declarationlines); 
            declarationlines = this.removeEmptyLines(declarationlines)
            template = template.replaceAll(`${gs}`, `${gs} \n ${declarationlines.join('\n')}`)

            for (let arr of Object.keys(root)) {
                if (Array.isArray((root as any)[arr]))
                      template = await root.render(level, template, arr);
            }
           
            // remove the markers
            for (let marker of ['setup', 'local', 'global', 'imports', 'styles']) {
                for (let i = 10; i > 0; i--) {
                    let placeholder = `[[${'.'.repeat(i)}${marker}]]`
                    if (template.indexOf(placeholder) > -1) {
                        template = template.replaceAll(`${placeholder}`, ``)
                    }
                }
            }
            return template.replaceAll(gs, "").replaceAll(imports, "").replaceAll(usup, "").replaceAll(ulsp, "").replaceAll(styles, "").replaceAll(/\[\[[a-z]+\]\]/gi,"");
    }
}