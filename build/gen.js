import * as fs from 'fs';
import { RenderWidget } from "./ast.js";
export class Generator {
    async generate(target, app, translation) { return fs.writeFileSync(target.output, await this.#_generateCode(target, this.#_loadComponents(app), translation)); }
    #_loadComponents(app) { return RenderWidget.fromObject(app); }
    async #_generateCode(target, tree, translation) { return await RenderWidget.render(target, tree, translation) || ""; }
}
//# sourceMappingURL=gen.js.map