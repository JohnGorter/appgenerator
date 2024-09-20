import express from 'express';
import JGen from './index.js';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
const app = express();
class Car {
    make;
    model;
    constructor(make, model) {
        this.make = make;
        this.model = model;
    }
}
const cars = [
    new Car("Mercedes", "CLA"),
    new Car("BMW", "2"),
    new Car("Audi", "Quattro"),
    new Car("Jeep", "Whatever"),
    new Car("Range Rover", "Dont know"),
];
app.use(express.json());
app.get("/server.html", (req, res) => {
    res.end(readFileSync(__dirname + "/server.html"));
});
app.use("/react", express.static(__dirname + "/react"));
app.use("/flutter", express.static(__dirname + "/flutter/build/web"));
app.use("/", express.static(__dirname + "/flutter/build/web"));
app.post('/app', async (req, res) => {
    console.log("--->", JSON.stringify(req.body));
    await new JGen().start(JSON.stringify(req.body));
    console.log("done±");
    return res.redirect(`/${req.body.app.target}/index.html`);
});
app.get('/cars', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(cars));
});
app.listen(1337, () => {
    // console.log("listening")
});
//# sourceMappingURL=server.js.map