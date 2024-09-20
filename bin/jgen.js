#!/usr/bin/env node


import JGen from '../build/index.js'


let [,,args] = process.argv

// console.log("hello world", args)

console.log("setting file", file)
let f = readFileSync(args[0], 'utf-8')

new JGen().start(f, true)