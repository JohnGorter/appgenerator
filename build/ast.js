import { translationmap } from './translationmap.js';
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
    renderLocalScope() {
        let template = this._renderScope("execution");
        let me = this;
        if (me.source) {
            let statements = `##SOURCE##.getValue()\n`.replaceAll(`##SOURCE##`, `datasource` + me.source);
            template = template.replaceAll(`##SOURCE##`, statements);
        }
        let statements = "";
        if (me.triggers) {
            for (let t of me.triggers) {
                statements += `##TRIGGER##.setValue(##TRIGGER##.getValue() + 1)\n`.replaceAll(`##TRIGGER##`, `datasource` + t.id);
            }
            statements = statements + "";
        }
        template = template.replaceAll(`##TRIGGERS##`, statements);
        return template;
    }
    renderDeclaration() {
        return this._renderScope("declaration");
    }
    renderGlobalScope() {
        return this._renderScope("global");
    }
    renderSetupScope() {
        return this._renderScope("setup");
    }
    _renderScope(scope) {
        let result = translationmap.get(this.constructor.name.toLowerCase() + "_" + scope)?.template;
        if (!result)
            return "";
        return this.parseResult(result);
    }
}
export class App extends Renderable {
    constructor(id, s) {
        super(id, s);
    }
}
export class DataSource extends Renderable {
    constructor(id, s) {
        super(id, s);
    }
}
export class Container extends Renderable {
    constructor(id, s) {
        super(id, s);
    }
}
export class Button extends Renderable {
    constructor(id, s) {
        super(id, s);
    }
}
export class Label extends Renderable {
    constructor(id, s) {
        super(id, s);
    }
}
export class RenderWidget {
    static #classes = new Map();
    static {
        this.#classes.set("app", App);
        this.#classes.set("datasource", DataSource);
        this.#classes.set("container", Container);
        this.#classes.set("label", Label);
        this.#classes.set("button", Button);
    }
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
    static fromObject(o) {
        let target = Object.values(o)[0];
        let ctor = this.#classes.get(Object.keys(o)[0]);
        if (!ctor)
            ctor = Renderable;
        console.log("o", target.id);
        let tree = ctor ? new ctor(target.id, target) : null;
        if (tree) {
            // resolve triggers and sources
            for (let c of tree.children) {
                let b = c;
                if (b.trigger != null) {
                    let triggers = b.trigger.split(",");
                    for (let t of triggers) {
                        let e = RenderWidget.findTreeElement(t, tree);
                        if (e) {
                            e.triggers = e.triggers || [];
                            e.triggers.push(c);
                        }
                    }
                }
            }
        }
        return tree;
    }
    static render(root) {
        let template = translationmap.get("root")?.template;
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
            r += c.renderDeclaration();
            types.push(c.constructor.name);
        }
        template = template.replaceAll(`${gs}`, `${gs} \n ${r}`);
        // walk the tree and render the global section
        r = "";
        for (let c of root.children) {
            r += c.renderGlobalScope();
        }
        template = template.replaceAll(`${gs}`, `${gs} \n ${r}`);
        // walk the tree and render the global section
        let l = "";
        for (let c of root.children) {
            l += c.renderLocalScope();
        }
        template = template.replaceAll(`${ls}`, `${ls} \n ${l}`);
        // walk the tree and render the global section
        let s = "";
        for (let c of root.children) {
            s += c.renderSetupScope();
        }
        template = template.replaceAll(`${su}`, `${su} \n ${s}`);
        return template;
    }
}
//# sourceMappingURL=ast.js.map