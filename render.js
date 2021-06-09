const path = require('path');
//this uses jsdom from npm
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

//this is a method to render an html file, simulating a browser
//environment with a dom
const render = async (filename) => {
    //run this in the directory where the file is located
    const filePath = path.join(process.cwd(), filename);

    const dom = await JSDOM.fromFile(filePath, {
        //by default the ability to execute scripts embedded in 
        //the html is disabled because code running in jsdom can
        //have access to the Node.js environment, and therefore
        //to the files on the machine running it
        //we are telling jsdom to run scripts, even though it
        //would be dangerous to do so with untrusted code
        runScripts: 'dangerously',

        //setting resources to usable allows jsdom to load
        //resources like scripts, stylesheets, etc
        resources: 'usable'
    });

    return dom;
}; 

module.exports = render;