import * as fs from 'fs';
import { RenderWidget } from "./ast.js";
export class Generator {
    #app = {};
    async generate(target, app, translation) {
        this.#app = app;
        fs.writeFileSync(target.output, await this.#_generateCode(target, this.#_loadComponents(), translation));
    }
    #_loadComponents() {
        return RenderWidget.fromObject(this.#app);
    }
    async #_generateCode(target, tree, translation) {
        return await RenderWidget.render(target, tree, translation) || "";
    }
}
//# sourceMappingURL=gen.js.map