#!/usr/bin/env node


import JGen from '../build/index.js'
import { readFileSync } from 'fs'

let [,,args] = process.argv

// console.log("hello world", args)
let f = readFileSync(args, 'utf-8')

new JGen().start(f, true)