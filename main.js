
const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({extended: true}));
// app.use(express.static('DB/urls-bin'));

app.use(cors()); 


app.listen( 3000 , ()=>{
    console.log("listen at 3000")
});
app.use(express.json());


app.post("/" , (req , res)=>{
    const url = req.body.url;
    console.log(url);
    const bin = JSON.parse(fs.readFileSync(`./DB/urls-bin/short-urls.json`));
    if(url in bin){
        
        res.send(bin[url].shorturl).status(200);
        return;
    }
    fetch(url).then((response)=>{
        if(response.ok){
            console.log(response);
            let newID = JSON.parse(fs.readFileSync(`./DB/id-genrator.json`)).counter;
            console.log(newID);
            bin[url] = {
                creationDate : new Date() ,
                redirectCount :  0 ,
                originalUrl : url,
                shorturl : `http://localhost:3000/${newID}` ,
                id : newID
            };
            ++newID;
            console.log(newID);
            fs.writeFileSync(`./DB/urls-bin/short-urls.json` , JSON.stringify(bin , null, 4));
            fs.writeFileSync(`./DB/id-genrator.json` , JSON.stringify({counter : newID }));
            res.status(200).json( bin[url]);
            
        }else{
            console.log(response);
          res.send("invalid website");  
        }
    });
});

app.get ("/:id" , (request , response)=>{
    console.log(request.params);
    // let params = request.params
    const { id } = request.params;
    console.log(id);
    const bin = JSON.parse(fs.readFileSync(`./DB/urls-bin/short-urls.json`));
    let originalUrl = false;
    console.log(bin);
   
    for (const prop in bin) {
      const urlPROP = bin[prop]
      if(urlPROP.id === Number(id) ){
        originalUrl = urlPROP.originalUrl;
      }
    }
    if(!originalUrl){
        throw new Error("not found");
    }
    response.redirect(301 , originalUrl);
    
});