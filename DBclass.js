const fs = require("fs");

class Db{
    constructor(){

    }
    writeFile(filePath , data ){
        return new Promise((resolve ,reject)=>{
            fs.writeFile( filePath , data ,'utf8', (err)=>{
               if(err){
                   console.log("wile fs.writefile");
                   reject(err)
               }else{
                   resolve(true)
               } 
            });
         
         });   

    }
    readFile(filePath){
        return new Promise((resolve ,reject)=>{
            fs.readFile(filePath , 'utf8', (err, data)=>{
               if(err){
                   console.log("wile fs.readfile");
                   reject(err )
               }else{
                   resolve(data)
               } 
            });
         
         }); 
        
    }
    
    // READCOUNTER()
    // UPDATECOUNTER()

}
module.exports = Db;