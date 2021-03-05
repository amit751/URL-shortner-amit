
const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('DB/urls-bin'));

app.use(cors()); 


app.listen( 3000 , ()=>{
    console.log("listen at 3000")
});
app.use(express.json());

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
dataBase = new Db;

app.get ("/:id" , (request , response)=>{
    console.log( "inside get");
    // console.log(request.params);
    // let params = request.params
    const { id } = request.params;
    dataBase.readFile(`./DB/urls-bin/short-urls.json`)
    .then((data)=>{
        const bin = JSON.parse(data);
        let originalUrl = false;
        for (const prop in bin) {
            const urlPROP = bin[prop]
            if(urlPROP.id === Number(id) ){
              originalUrl = urlPROP.originalUrl;
            }
        }if(!originalUrl){
            throw new Error("not found-there is not such url");
        }
        response.redirect(303 , originalUrl); 
        return;
    })
    .catch((err)=>{
        res.json(err);
        return;
    })
    // console.log(id);
    // const bin = JSON.parse(fs.readFileSync(`./DB/urls-bin/short-urls.json`));
    // let originalUrl = false;
    // // console.log(bin);
   
    // for (const prop in bin) {
    //   const urlPROP = bin[prop]
    //   if(urlPROP.id === Number(id) ){
    //     originalUrl = urlPROP.originalUrl;
    //   }
    // }
    // console.log(":origin url" , originalUrl);
    // if(!originalUrl){
    //     throw new Error("not found");
        
    // }
    // response.redirect(303 , originalUrl);
    return;
    
});


function readFileSUCSESS(counterData , bin , url , res){
   console.log("here res" );
    let newID = JSON.parse(counterData).counter; 
    bin[url] = {
        creationDate : new Date() ,
        redirectCount :  0 ,
        originalUrl : url,
        shorturl : `http://localhost:3000/${newID}` ,
        id : newID
    };
    ++newID;
    dataBase.writeFile(`./DB/urls-bin/short-urls.json` , JSON.stringify(bin , null, 4))
    .then((resultfromurl)=>{
        dataBase.writeFile(`./DB/id-genrator.json` , JSON.stringify({counter : newID }))
        .then((resultfromcounter)=>{
            return res.json( bin[url]); //status undifined 
        }) 
    }).catch((err)=>{
        console.log("db.writefile faild could not save to db");
        return res.json( err); 
    }); 
    // Promise.all([ dataBase.writeFile(`./DB/urls-bin/short-urls.json` , JSON.stringify(bin , null, 4)) , 
    //  dataBase.writeFile(`./DB/id-genrator.json` , JSON.stringify({counter : newID }))])
    // .then((values)=>{
    //     return res.status(200).json( bin[url]); 
    // }).catch((err)=>{
    //     console.log("db.writefile faild could not save to db");
    //     return res.json( err); 
    // }); 
    
}
function readFileFail(err , res){
    return res.send(err);
    
}

function onFullfild(data ,url , res){
    const bin = JSON.parse(data);
    if(url in bin){
        res.send(bin[url].shorturl).status(200);
        return;
    }if(url === false){
        res.json({url : `${url} isnot valid` }).status(200);
    }
    return fetch(url)
    .then((response)=>{
        if(response.ok){
            dataBase.readFile(`./DB/id-genrator.json`)
            .then((counterData)=>{
                readFileSUCSESS(counterData , bin , url , res);
            } , (err)=>{
                readFileFail(err);
            });
            return;
            
        }else{
          res.send("invalid website");
          return;  
        }
    }).catch((e)=>{
        console.log(`couldnt fetch to${url}`);
        return res.send("invalid website");
        
    });
}
app.post("/urlshorts" , (req , res)=>{
    const url = req.body.url;
    console.log("nowwwww" , url);
    dataBase.readFile(`./DB/urls-bin/short-urls.json`)
    .then((data)=>{
        return onFullfild(data ,url ,res);
    })
    .catch((err)=>{
        console.log(err , "in post");
        return res.send(err);
    });
});























// app.post("/urlshorts" , (req , res)=>{
//     const url = req.body.url;
//     console.log("nowwwww" , url);
    
//     const bin = JSON.parse(fs.readFileSync(`./DB/urls-bin/short-urls.json`));
//     if(url in bin){
//         console.log("short exist");
//         res.send(bin[url].shorturl).status(200);
//         return;
//     }if(url === false){
//         res.json({url : `${url} isnot valid` }).status(200);
//     }
//    return fetch(url).then((response)=>{
//         if(response.ok){
//             // console.log(response);
//             let newID = JSON.parse(fs.readFileSync(`./DB/id-genrator.json`)).counter;
//             // console.log(newID);
//             bin[url] = {
//                 creationDate : new Date() ,
//                 redirectCount :  0 ,
//                 originalUrl : url,
//                 shorturl : `http://localhost:3000/${newID}` ,
//                 id : newID
//             };
//             ++newID;
//             // console.log(newID);
//             fs.writeFileSync(`./DB/urls-bin/short-urls.json` , JSON.stringify(bin , null, 4));
//             fs.writeFileSync(`./DB/id-genrator.json` , JSON.stringify({counter : newID }));
//             res.status(200).json( bin[url]);
//             console.log("end post");
//             return;
            
//         }else{
//             // console.log(response);
//           res.send("invalid website");
//           return;  
//         }
//     });
    
// });





// dataBase.writeFile(`./DB/urls-bin/test.json`, JSON.stringify({data: "test"} , null, 4)).then((result)=>{
//     if (result){
//         dataBase.readFile(`./DB/urls-bin/test.json`).then((data)=>{console.log(data);});
//     }
// });

