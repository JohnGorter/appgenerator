import * as fs from 'fs';
import { RenderWidget } from "./ast.js";
export class Generator {
    #app = {};
    async generate(target, app) {
        this.#app = app;
        fs.writeFileSync(target.output, await this.#_generateCode(target, this.#_loadComponents()));
    }
    #_loadComponents() {
        return RenderWidget.fromObject(this.#app);
    }
    async #_generateCode(target, tree) {
        return await RenderWidget.render(target, tree) || "";
    }
}
//# sourceMappingURL=gen.js.map