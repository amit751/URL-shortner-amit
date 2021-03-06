
const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('DB/urls-bin'));

const {onFullfild , readFileFail , readFileSUCSESS } = require("./utils.js");
const Db = require("./DBclass.js");

app.use(cors()); 
app.listen( 3000 , ()=>{
    console.log("listen at 3000")
});
app.use(express.json());


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

