import express from 'express'
const app = express(); 

class Car {
    constructor(public make:String, public model:string){}
}

const cars:Car[] = [
    new Car("Mercedes", "CLA"),
    new Car("BMW", "2"),
    new Car("Audi", "Quattro"),
    new Car("Jeep", "Whatever"),
    new Car("Range Rover", "Dont know"),
]

app.get('/cars', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify(cars))
})

app.listen(1337, () => {
    console.log("listening")
});
