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
    async render(template, setupmarker, localmarker) {
        let me = this;
        let lsp = `{ /* [[${me.id}:local]] */ }`;
        let sup = `{ /* [[${me.id}:setup]] */ }`;
        // template = template.replaceAll(ls, lsp).replaceAll(su, sup)
        let localcode = await this.renderLocalScope();
        let setupcode = await this.renderSetupScope();
        template = template.replaceAll(`${localmarker}`, `${localmarker} \n ${localcode}`);
        template = template.replaceAll(`${setupmarker}`, `${setupmarker} \n ${setupcode}`);
        if (me.children) {
            for (let c of me.children) {
                template = await c.render(template, sup, lsp);
            }
        }
        return template.replaceAll(sup, "").replaceAll(lsp, "");
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
    async renderImportScope() {
        return await this._renderScope("imports");
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
            statements = this._renderStatements("trigger", triggers, me.action || me.label);
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
        return tree;
    }
    static async render(target, root, translation) {
        return this._render(target, root, translation);
    }
    static async _collectImportLines(root, lines) {
        lines.push(await root.renderImportScope());
        if (root.children) {
            for (let c of root.children) {
                await this._collectImportLines(c, lines);
            }
        }
    }
    static async _collectDeclarationLines(root, lines) {
        lines.push(await root.renderDeclaration());
        if (root.children) {
            for (let c of root.children) {
                await this._collectDeclarationLines(c, lines);
            }
        }
    }
    static async _collectGlobalLines(root, lines) {
        lines.push(await root.renderGlobalScope());
        if (root.children) {
            for (let c of root.children) {
                await this._collectGlobalLines(c, lines);
            }
        }
    }
    static async _render(target, root, translation) {
        //return import(`./translationmap.${target.translationmap}.js`).then(m => {
        //    translationmap = m.translationmap;
        // let template = translationmap.get("root")?.template
        globaltranslation = translation;
        let template = await translation.getTemplate("root");
        if (!template)
            return "-- error -- missing template";
        let gs = '// [[global]]';
        let imports = '// [[imports]]';
        template = root.parseResult(template);
        // walk the tree and render the global section
        let importlines = [];
        await this._collectImportLines(root, importlines);
        template = template.replaceAll(`${imports}`, `${imports} \n ${importlines.join('\n')}`);
        let globallines = [];
        await this._collectGlobalLines(root, globallines);
        template = template.replaceAll(`${gs}`, `${gs} \n ${globallines.join('\n')}`);
        let declarationlines = [];
        await this._collectDeclarationLines(root, declarationlines);
        template = template.replaceAll(`${gs}`, `${gs} \n ${declarationlines.join('\n')}`);
        let lsp = `{ /* [[${root.id}:local]] */ }`;
        let sup = `{ /* [[${root.id}:setup]] */ }`;
        // template = template.replaceAll(ls, lsp).replaceAll(su, sup)
        let localcode = await root.renderLocalScope();
        let setupcode = await root.renderSetupScope();
        template = template.replaceAll(`${lsp}`, `${lsp} \n ${localcode}`);
        template = template.replaceAll(`${sup}`, `${sup} \n ${setupcode}`);
        console.log("template before walk", template);
        // walk the tree and render the global section
        for (let c of root.children)
            template = await c.render(template, sup, lsp);
        console.log("template after walk", template);
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
        return template.replaceAll(gs, "").replaceAll(imports, "").template.replaceAll(sup, "").replaceAll(lsp, "");
        // });
    }
}
//# sourceMappingURL=ast.js.map