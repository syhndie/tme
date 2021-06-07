#!/usr/bin/env node

const Runner = require('./runner');

//create a new instance of the Runner class
const runner = new Runner();

const run = async () => {
    //run the collectFiles method on the current working directory
    const results = await runner.collectFiles(process.cwd());
    
}

run();