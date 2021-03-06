const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
// const {dataBase} = require("./main.js");
const Db = require("./DBclass.js");

const dataBase11 = new Db;



function readFileSUCSESS(counterData , bin , url , res){
    console.log("here res" );
    let newID = JSON.parse(counterData).counter; 
    bin[url] = {
        creationDate : new Date().toLocaleString().replace('.', '-').replace('.', '-').replace(',', ' ') ,
        redirectCount :  0 ,
        originalUrl : url,
        shorturl : `http://localhost:3000/${newID}` ,
        id : newID
    };
    ++newID;
    dataBase11.writeFile(`./DB/urls-bin/short-urls.json` , JSON.stringify(bin , null, 4))
    .then((resultfromurl)=>{
        dataBase11.writeFile(`./DB/id-genrator.json` , JSON.stringify({counter : newID }))
        .then((resultfromcounter)=>{
            return res.json( bin[url]).status(200); //status undifined 
        });//added; 
    }).catch((err)=>{
        console.log("db.writefile faild could not save to db");
        return res.json( err); 
    }); 
     
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
            dataBase11.readFile(`./DB/id-genrator.json`)
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
        console.log(e , `couldnt fetch to${url}`);
        return res.send("invalid website");
         
    });
}

// `couldnt fetch to${url}`
module.exports = {onFullfild , readFileFail , readFileSUCSESS };