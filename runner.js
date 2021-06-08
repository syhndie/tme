//fs module from the node standard library
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Runner {
   constructor() {
       this.testFiles = [];
   } 

   async runTests() {
       for (let file of this.testFiles) {
           console.log(chalk.gray(`---- ${file.shortName}`))
           //create an array to store beforeEach functions
           const beforeEaches = [];

           //define the beforeEach and  it functions glabally 
           //so we can use them for all of our tests
           //this is using the same logic used by mocha
           global.beforeEach = (fn) => {
               //pass beforeEach a function and store that
               //function in the beforeEaches array
               beforeEaches.push(fn);
           };
           global.it = (desc, fn) => {
               //whenever we run the it function, the first thing
               //we do is run all the beforeEach functions in our
               //beforeEaches array
               beforeEaches.forEach(func => func());

               //then we run whatever function we have passed in 
               //to the it method
               try {
                fn();
                console.log(chalk.greenBright(`\tOK - ${desc}`));
               } catch (err) {
                   //take the error message, globally in the string, replace
                   //every new line character (\n) with new line and two tab 
                   //characters (\n\t\t)
                   const message = err.message.replace(/\n/g, '\n\t\t');
                   console.log(chalk.red(`\tX - ${desc}`));
                   console.log(chalk.red('\t', message));
               }
           };
           //when we require the file, node will find the file
           //and run the code inside of it
           //wrap the require statement in a try-catch in case
           //the file is broken and crashes the testing
           try {
            require(file.name);
           } catch (err) {
               console.log(chalk.red(err));
           }
       }
   }

   async collectFiles(targetPath) {
       //this reads the files and folders in the given directory and 
       //saves their names to an array of strings
       const files = await fs.promises.readdir(targetPath);
       
       for (let file of files) {
           //this creates a string of the whole path plus the 
           //name of the file or folder
           const filepath = path.join(targetPath, file);

           //this creates an object that for each file or folder
           //the object includes methods to determine if it is a file or a folder
           const stats = await fs.promises.lstat(filepath);

            //if it is a file with '.test.js', we add an object 
            //to the end of the test files array
           if (stats.isFile() && file.includes('.test.js')) {
               this.testFiles.push({ name: filepath, shortName: file });
           } else if (stats.isDirectory()) {
               //if it is a directory we read the files and folders in it 
               //and save the names to an array
               const childFiles = await fs.promises.readdir(filepath);

               //the ... syntax references the individual elements of the array
               //for each eleement we join its name to the folder it was in 
               //then push that to the end of the array of files (and folders)
               //we are currently looping through, so it will get further processed
               //during this for loop
               files.push(...childFiles.map(f => path.join(file, f)));
           }
       }
   }
}

module.exports = Runner;