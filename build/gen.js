import * as fs from 'fs';
import { RenderWidget } from "./ast.js";
export class Generator {
    #app = {};
    generate(location, app) {
        this.#app = app;
        fs.writeFileSync(location, this.#_generateCode(this.#_loadComponents()));
    }
    #_loadComponents() {
        return RenderWidget.fromObject(this.#app);
    }
    #_generateCode(tree) {
        return RenderWidget.render(tree);
    }
}
//# sourceMappingURL=gen.js.map