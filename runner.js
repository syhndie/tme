//fs module from the node standard library
const fs = require('fs');
const path = require('path');

class Runner {
   constructor() {
       this.testFiles = [];
   } 

   async collectFiles(targetPath) {
       const files = await fs.promises.readdir(targetPath);
       
       for (let file of files) {
           
           const filepath = path.join(targetPath, file);

           const stats = await fs.promises.lstat(filepath);

           if (stats.isFile() && file.includes('.test.js')) {
               this.testFiles.push({ name: filepath });
           } else if (stats.isDirectory()) {
               const childFiles = await fs.promises.readdir(filepath);

               //the ... syntax references the individual elements of the array
               files.push(...childFiles.map(f => path.join(file, f)));
           }
       }
       console.log(files);
       console.log(this.testFiles);
   }
}

module.exports = Runner;