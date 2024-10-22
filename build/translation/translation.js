import * as fs from 'node:fs';
import { TraceWriter, traceWriter } from '../TraceWriter.js';
class Cache {
    static #cache = new Map();
    static async setGet(v) {
        let result = this.#cache.get(v);
        if (result) {
            return Promise.resolve(result);
        }
        else {
            let response = await fetch(v);
            let data = response.status == 200 ? await response.text() : "";
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
        traceWriter.info(`Extracting scope part from template ${scope}"`, TraceWriter.AREA_CODEGENERATION);
        let marker = `//#pragma: ${scope}`;
        if (data.indexOf(marker) < 0)
            return Promise.resolve('');
        let eosmarker = `//#pragma:`;
        let template = data.substring(data.indexOf(marker)).replace(marker, '');
        let end = template.indexOf(eosmarker);
        if (end > 0)
            template = template.substring(0, end);
        traceWriter.info(`Returning ${template}"`, TraceWriter.AREA_CODEGENERATION);
        return Promise.resolve(template.replaceAll(marker, ""));
    }
    async getExample(classname) {
        let extension = this.#target == "flutter" ? "dart" : "js";
        traceWriter.info(`Trying to retrieve template "./translation/${this.#target}/${classname}.${extension}"`, TraceWriter.AREA_CODEGENERATION);
        if (fs.existsSync(`./translation/${this.#target}/${classname}.${extension}`)) {
            // read template from template file
            let data = fs.readFileSync(`./translation/${this.#target}/${classname}.${extension}`, 'utf8');
            traceWriter.info(`Retrieved template "./translation/${this.#target}/${classname}.${extension}"`, TraceWriter.AREA_CODEGENERATION);
            return this.returnDataForScope(data, "example");
        }
        else {
            traceWriter.info(`No file, retieve translation from translation map`, TraceWriter.AREA_CODEGENERATION);
            let m = await import(`./translationmap.${this.#target}.js`);
            let url = m.translationmap.get(`${classname}`)?.url;
            if (url) {
                traceWriter.info(`Retrieving url ${url}`, TraceWriter.AREA_CODEGENERATION);
                url = url.replace("https://github.com", "https://raw.githubusercontent.com").replace("/blob", "");
                traceWriter.info(`Retrieving url ${url}`, TraceWriter.AREA_CODEGENERATION);
                // replace obvious mistaktes to be more intuitive..
                let data = await Cache.setGet(url);
                return this.returnDataForScope(data, "example");
            }
            else {
                traceWriter.info(`Retrieving example`, TraceWriter.AREA_CODEGENERATION);
                let template = m.translationmap.get(`${classname}${'_example'}`)?.template;
                return template;
            }
        }
    }
    async getTemplate(classname, scope) {
        let extension = this.#target == "flutter" ? "dart" : "js";
        traceWriter.info(`Trying to retrieve template "./translation/${this.#target}/${classname}.${extension}"`, TraceWriter.AREA_CODEGENERATION);
        if (fs.existsSync(`./translation/${this.#target}/${classname}.${extension}`)) {
            // read template from template file
            let data = fs.readFileSync(`./translation/${this.#target}/${classname}.${extension}`, 'utf8');
            traceWriter.info(`Retrieved template "./translation/${this.#target}/${classname}.${extension}"`, TraceWriter.AREA_CODEGENERATION);
            if (scope) {
                return this.returnDataForScope(data, scope);
            }
            else {
                return Promise.resolve(data);
            }
        }
        else {
            traceWriter.info(`No file, retieve translation from translation map`, TraceWriter.AREA_CODEGENERATION);
            let m = await import(`./translationmap.${this.#target}.js`);
            let url = m.translationmap.get(`${classname}`)?.url;
            if (url) {
                traceWriter.info(`Retrieving url ${url}`, TraceWriter.AREA_CODEGENERATION);
                url = url.replace("https://github.com", "https://raw.githubusercontent.com").replace("/blob", "");
                traceWriter.info(`Retrieving url ${url}`, TraceWriter.AREA_CODEGENERATION);
                // replace obvious mistaktes to be more intuitive..
                let data = await Cache.setGet(url);
                if (scope) {
                    return this.returnDataForScope(data, scope);
                }
                else {
                    return Promise.resolve(data);
                }
            }
            else {
                traceWriter.info(`Retrieving template from map for scope ${scope}`, TraceWriter.AREA_CODEGENERATION);
                let template = m.translationmap.get(`${classname}${scope ? '_' + scope : ''}`)?.template;
                return template;
            }
        }
    }
    async getConfig(classname) {
        let extension = this.#target == "flutter" ? "dart" : "js";
        traceWriter.info(`Retrieving config from map for config`, TraceWriter.AREA_CODEGENERATION);
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
            return Promise.resolve(eval("(" + template + ")"));
        }
        else {
            let m = await import(`./translationmap.${this.#target}.js`);
            let url = m.translationmap.get(`${classname}`)?.url;
            if (url) {
                traceWriter.info(`Retrieving url ${url}`, TraceWriter.AREA_CODEGENERATION);
                url = url.replace("https://github.com", "https://raw.githubusercontent.com").replace("/blob", "");
                traceWriter.info(`Retrieving url ${url}`, TraceWriter.AREA_CODEGENERATION);
                // replace obvious mistaktes to be more intuitive..
                let data = await Cache.setGet(url);
                let result = await this.returnDataForScope(data, "config");
                if (result) {
                    return Promise.resolve(eval("(" + result + ")"));
                }
                else
                    return Promise.resolve("");
            }
            else {
                traceWriter.info(`Retrieving config from map for config`, TraceWriter.AREA_CODEGENERATION);
                return m.translationmap.get(`${classname}_config`)?.config;
            }
        }
    }
}
//# sourceMappingURL=translation.js.map