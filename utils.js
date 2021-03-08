const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
// const {dataBase} = require("./main.js");
const Db = require("./DBclass.js");

const dataBase11 = new Db;
const  dir = process.env.NODE_ENV === 'test' ? './DB-TEST' : './DB';

///
function readFileSUCSESS(counterData , bin , url , res){
    
    let newID = JSON.parse(counterData).counter; 
    bin[url] = {
        creationDate : new Date().toLocaleString().replace('.', '-').replace('.', '-').replace(',', ' ') ,
        redirectCount :  0 ,
        originalUrl : url,
        shorturl : `http://localhost:3000/${newID}` ,
        id : newID
    };
    ++newID;
    dataBase11.writeFile(`${dir}/urls-bin/short-urls.json` , JSON.stringify(bin , null, 4))
    .then((resultfromurl)=>{
        dataBase11.writeFile(`${dir}/id-genrator.json` , JSON.stringify({counter : newID }))
        .then((resultfromcounter)=>{
            return res.status(200).json( bin[url]); //status undifined 
        });//added; 
    }).catch((err)=>{
        console.log("db.writefile faild could not save to db");
        return res.json( err); 
    }); 
     
}

function readFileFail(err , res){
    return res.send(err);
     
}
function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};
 
function onFullfild(data ,url , res){
    const bin = JSON.parse(data);
    if(url in bin){
        res.status(200).send(bin[url].shorturl);
        return;
    }if(!isValidURL(url)){
        res.status(200).json( [`${url} isnot valid`] );
    }
    return fetch(url)
    .then((response)=>{
        if(response.ok){
            dataBase11.readFile(`${dir}/id-genrator.json`)
            .then((counterData)=>{
                readFileSUCSESS(counterData , bin , url , res);
            } , (err)=>{
                readFileFail(err);
            });
            return;
             
        }else{
            res.status(202).send("invalid website");
            return;  
        }
    }).catch((e)=>{
        console.log(e , `couldnt fetch to${url}`);
        return res.status(200).send(`couldnt fetch to${url}`);
         
    });
}


module.exports = {onFullfild , readFileFail , readFileSUCSESS };