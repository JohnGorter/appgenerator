let globaltranslation = undefined;
export class Renderable {
    id;
    children = [];
    constructor(id, state) {
        this.id = id;
        this.fromState(state);
    }
    fromState(s) {
        for (let p of Object.keys(s)) {
            if (p == "children") {
                for (let c of s[p]) {
                    let r = RenderWidget.fromObject(c);
                    if (r)
                        this.children.push(r);
                }
            }
            else {
                this[p] = s[p];
            }
        }
    }
    parseResult(result) {
        if (result) {
            let me = this;
            for (let k of Object.keys(me)) {
                console.log("replacing", k, me[k]);
                result = result.replaceAll(`[[${k}]]`, me[k]);
            }
        }
        return result;
    }
    async renderLocalScope() {
        return await this._renderScope("execution");
    }
    async renderDeclaration() {
        return await this._renderScope("declaration");
    }
    async renderGlobalScope() {
        return await this._renderScope("global");
    }
    async renderSetupScope() {
        return await this._renderScope("setup");
    }
    async _renderScope(scope) {
        let result = await globaltranslation.getTemplate(this.constructor.name.toLowerCase(), scope);
        if (!result)
            return "";
        let template = this.parseResult(result);
        let me = this;
        let statements = "";
        if (me.source) {
            statements = this._renderStatements("source", [me.source], undefined);
        }
        template = template.replaceAll(`##SOURCE##`, statements);
        statements = "";
        if (me.triggers) {
            let triggers = me.triggers.split(",");
            console.log("triggers:", triggers);
            statements = this._renderStatements("trigger", triggers, me.action);
        }
        template = template.replaceAll(`##TRIGGERS##`, statements);
        return template;
    }
    _renderStatements(target, placeholders, action) {
        let statements = "";
        if (target == "trigger")
            // let params = null;
            for (let t of placeholders) {
                statements += `datasource${t}.${action || 'refresh'}(event);\n`;
            }
        if (target == "source")
            for (let t of placeholders) {
                statements += `datasource${t}.${action || 'getValue'}()\n`;
            }
        statements = statements + "";
        return statements;
    }
}
export class RenderWidget {
    static findTreeElement(id, r) {
        let element = null;
        for (let c of r.children) {
            if (c.id == id)
                return c;
            element = this.findTreeElement(id, c);
            if (element)
                return element;
        }
        return element;
    }
    static generateClass(classname) {
        return eval(`
            (class ${classname} extends ${Renderable} {
                constructor(id, s){
                    super(id, s); 
                }
        })
   `);
    }
    static fromObject(o) {
        let classname = Object.keys(o)[0];
        let target = Object.values(o)[0];
        let ctor = RenderWidget.generateClass(classname);
        if (!ctor)
            ctor = Renderable;
        console.log("o", target.id);
        let tree = ctor ? new ctor(target.id, target) : null;
        if (tree) {
            // // resolve triggers and sources
            // for(let c of tree.children) {
            // let b:any = c;
            // if (b.trigger != null) {
            //     let triggers = b.trigger.split(",")
            //     for (let t of triggers) {
            //     let e = RenderWidget.findTreeElement(t, tree)
            //      if (e) {
            //         e.triggers = e.triggers || [];
            //         e.triggers.push(c)
            //      }
            //     }
            // }
            // }
        }
        return tree;
    }
    static async render(target, root, translation) {
        //return import(`./translationmap.${target.translationmap}.js`).then(m => {
        //    translationmap = m.translationmap;
        // let template = translationmap.get("root")?.template
        globaltranslation = translation;
        let template = await translation.getTemplate("root");
        if (!template)
            return "-- error -- missing template";
        let ls = '{ /* [[local]] */ }';
        let gs = '// [[global]]';
        let su = '{ /* [[setup]] */ }';
        template = root.parseResult(template);
        // walk the tree and render the global section
        let r = "";
        let types = [];
        for (let c of root.children) {
            if (types.find(t => t == c.constructor.name))
                continue;
            r += await c.renderDeclaration();
            types.push(c.constructor.name);
        }
        template = template.replaceAll(`${gs}`, `${gs} \n ${r}`);
        // walk the tree and render the global section
        r = "";
        for (let c of root.children) {
            r += await c.renderGlobalScope();
        }
        template = template.replaceAll(`${gs}`, `${gs} \n ${r}`);
        // walk the tree and render the global section
        let l = "";
        for (let c of root.children) {
            l += await c.renderLocalScope();
        }
        template = template.replaceAll(`${ls}`, `${ls} \n ${l}`);
        // walk the tree and render the global section
        let s = "";
        for (let c of root.children) {
            s += await c.renderSetupScope();
        }
        template = template.replaceAll(`${su}`, `${su} \n ${s}`);
        return template.replaceAll(gs, "").replaceAll(ls, "").replaceAll(su, "");
        // });
    }
}
//# sourceMappingURL=ast.js.map