import * as fs from 'node:fs';
class Cache {
    static #cache = new Map();
    static async setGet(v) {
        let result = this.#cache.get(v);
        if (result) {
            return Promise.resolve(result);
        }
        else {
            let data = await (await fetch(v)).text();
            this.#cache.set(v, data);
            return Promise.resolve(data);
        }
    }
}
export class Translation {
    #target;
    constructor(target) {
        this.#target = target;
    }
    async returnDataForScope(data, scope) {
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
    async getTemplate(classname, scope) {
        let extension = this.#target == "flutter" ? "dart" : "js";
        if (fs.existsSync(`./translation/${this.#target}/${classname}.${extension}`)) {
            // read template from template file
            let data = fs.readFileSync(`./translation/${this.#target}/${classname}.${extension}`, 'utf8');
            if (scope) {
                return this.returnDataForScope(data, scope);
            }
            else {
                return Promise.resolve(data);
            }
        }
        else {
            let m = await import(`./translationmap.${this.#target}.js`);
            let url = m.translationmap.get(`${classname}`)?.url;
            if (url) {
                url = url.replace("https://github.com", "https://raw.githubusercontent.com").replace("/blob", ""); // replace obvious mistaktes to be more intuitive..
                let data = await Cache.setGet(url);
                if (scope) {
                    return this.returnDataForScope(data, scope);
                }
                else {
                    return Promise.resolve(data);
                }
            }
            else {
                let template = m.translationmap.get(`${classname}${scope ? '_' + scope : ''}`)?.template;
                return template;
            }
        }
    }
    async getConfig(classname) {
        console.log("getting config for ", classname);
        let extension = this.#target == "flutter" ? "dart" : "js";
        if (fs.existsSync(`./translation/${this.#target}/${classname}.${extension}`)) {
            // read template from template file
            let data = fs.readFileSync(`./translation/${this.#target}/${classname}.${extension}`, 'utf8');
            let marker = `//#pragma: config`;
            // debugger;
            if (data.indexOf(marker) < 0)
                return Promise.resolve('');
            let eosmarker = `//#pragma:`;
            let template = data.substring(data.indexOf(marker)).replace(marker, '');
            let end = template.indexOf(eosmarker);
            if (end > 0)
                template = template.substring(0, end);
            console.log("getting config for ", template);
            return Promise.resolve(eval("(" + template + ")"));
        }
        else {
            let m = await import(`./translationmap.${this.#target}.js`);
            console.log("getting config for ", m.translationmap.get(`${classname}_config`)?.config);
            return m.translationmap.get(`${classname}_config`)?.config;
        }
    }
}
//# sourceMappingURL=translation.js.map