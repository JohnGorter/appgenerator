import express from 'express';
import JGen from './index.js';
import path from 'path';
import { read, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express(); 

class Car {
    constructor(public make:String, public model:string, public detail:string, public image:string){}
}

const cars:Car[] = [
    new Car("Mercedes", "CLA", "This is a great car", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVHqwbrOEbcYsaeZbWHLUXa7Ye55W_CALv4w&s"),
    new Car("BMW", "2", "This is also a great car", "https://www.bmw.nl/content/dam/bmw/common/all-models/m-series/m235i/2019/navigation/BMW-2-Series-gran-coupe_ModelCard.png"),
    new Car("Audi", "Quattro", "This is not a great car", "https://uploads.audi-mediacenter.com/system/production/media/13182/images/9070439c87474570d36def53ac8e39936da1d928/PQ100050_web_2880.jpg?1698189734"),
    new Car("Jeep", "Whatever", "This is an even greater car", "https://www.jeep.co.uk/content/dam/jeep/crossmarket/wrangler-full-model-mca-2024/02-trim-selector/sahara/figurines/sahara-black-565x330.png"),
    new Car("Range Rover", "Dont know", "This is a great 4 by 4", "https://jlr.scene7.com/is/image/jlr/L460_22MY_SV_002_GLHD_DX_2560x1440"),
]

app.use(express.json())

app.get("/server.html", (req, res) =>{
    res.end(readFileSync(__dirname + "/server.html"))
});
app.use("/react", express.static(__dirname + "/react"));
app.use("/flutter", express.static(__dirname + "/flutter/build/web"));
app.use("/", express.static(__dirname + "/flutter/build/web"));

app.post('/app', async (req, res) => {
   console.log("--->", JSON.stringify(req.body))
   await new JGen().start(JSON.stringify(req.body))
   console.log("done±")
   return res.redirect(`/${req.body.app.target}/index.html`);
})

app.get('/cars', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify(cars))
})

app.listen(1337, () => {
    // console.log("listening")
});
