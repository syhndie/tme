//fs module from the node standard library
const fs = require('fs');
const path = require('path');

class Runner {
   constructor() {
       this.testFiles = [];
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
               this.testFiles.push({ name: filepath });
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
       console.log(files);
       console.log(this.testFiles);
   }
}

module.exports = Runner;