
const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const cors = require("cors");
const app = express();

const {onFullfild , readFileFail , readFileSUCSESS } = require("./utils.js");
const Db = require("./DBclass.js");



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('DB/urls-bin'));///not in use
app.use(cors()); 

const  dir = process.env.NODE_ENV === 'test' ? './DB-TEST' : './DB';


const dataBase = new Db;


app.get ("/:id" , (request , response)=>{
    console.log( "inside get");
    const { id } = request.params;
    dataBase.readFile(`${dir}/urls-bin/short-urls.json`)
    .then((data)=>{
        const bin = JSON.parse(data);
        let originalUrl = false;
        for (const prop in bin) {
            const urlPROP = bin[prop]
            if(urlPROP.id === Number(id) ){
              originalUrl = urlPROP.originalUrl;
              urlPROP.redirectCount++ ; 
            }
        }if(!originalUrl){
           return response.status(400).send("not found-there is not such url");
            // throw new Error("not found-there is not such url");/////////can remove
        }
        response.redirect(303 , originalUrl); 
        dataBase.writeFile(`${dir}/urls-bin/short-urls.json` ,  JSON.stringify(bin , null, 4))
        .then((result)=>{
            console.log("counter updated sucsesfuly" );
            return;
        }).catch((error)=>{
            console.log( error , "counter failed to update");
        })
        // return;

    })
    .catch((err)=>{
        console.log("failed to read file from db ," , err );
        return response.status(202).send("failed to read file from db , err acured");
        // return;
    });

    return;
    
});



app.post("/urlshorts" , (req , res)=>{
    const url = req.body.url;
    console.log("nowwwww" , url);
    dataBase.readFile(`${dir}/urls-bin/short-urls.json`)
    .then((data)=>{
        return onFullfild(data ,url ,res);
    })
    .catch((err)=>{
        console.log(err , "in post wile reading file");
        return res.send(err);
    });
});


app.get("/statistic/:id" , (req , res)=>{
    const id = req.params.id;
    dataBase.readFile(`${dir}/urls-bin/short-urls.json`)
    .then((data)=>{
        const bin = JSON.parse(data);
        let urlStatistic = false;
        for (const url in bin) {
            const urlOBJ = bin[url];
            if(urlOBJ.id === Number(id) ){
                urlStatistic = urlOBJ;
            }
        }if(!urlStatistic){
            console.log("there is no such short url in db");
           return res.status(200).send("not found-there is no such url");
        }
        return res.status(200).json(urlStatistic);
       
    }).catch((err)=>{
        console.log("couldnt read data from db" , err);
        return res.status(200).send("couldnt read data from db");
    });

});

app.listen( 3000 , ()=>{
    console.log("listen at 3000");
});


module.exports = app;

















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

