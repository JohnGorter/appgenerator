#!/usr/bin/env node


import JGen from '../build/index.js'


let [,,args] = process.argv

console.log("hello world", args)

new JGen().start(args)