import * as fs from 'node:fs';
export class Translation {
    #target;
    constructor(target) {
        this.#target = target;
    }
    async getTemplate(classname, scope) {
        let extension = this.#target == "flutter" ? "dart" : "js";
        if (fs.existsSync(`./translationmap/${this.#target}/${classname}.${extension}`)) {
            // read template from template file
            let data = fs.readFileSync(`./translationmap/${this.#target}/${classname}.${extension}`, 'utf8');
            if (scope) {
                let marker = `//#pragma: ${scope}`;
                if (data.indexOf(marker) < 0)
                    return Promise.resolve('');
                let eosmarker = `//#pragma:`;
                let template = data.substring(data.indexOf(marker)).replace(marker, '');
                let end = template.indexOf(eosmarker);
                if (end > 0)
                    template = template.substring(0, end);
                return Promise.resolve(template);
            }
            else {
                return Promise.resolve(data);
            }
        }
        else {
            let m = await import(`./translationmap.${this.#target}.js`);
            return m.translationmap.get(`${classname}${scope ? '_' + scope : ''}`)?.template;
        }
    }
    async getConfig(classname) {
        let extension = this.#target == "flutter" ? "dart" : "js";
        if (fs.existsSync(`./translationmap/${this.#target}/${classname}.${extension}`)) {
            // read template from template file
            let data = fs.readFileSync(`./translationmap/${this.#target}/${classname}.${extension}`, 'utf8');
            let marker = `//#pragma: config`;
            if (data.indexOf(marker) < 0)
                return Promise.resolve('');
            let eosmarker = `//#pragma:`;
            let template = data.substring(data.indexOf(marker)).replace(marker, '');
            let end = template.indexOf(eosmarker);
            if (end > 0)
                template = template.substring(0, end);
            return Promise.resolve(eval(template));
        }
        else {
            let m = await import(`./translationmap.${this.#target}.js`);
            return m.translationmap.get(`${classname}_config`)?.config;
        }
    }
}
//# sourceMappingURL=transation.js.map