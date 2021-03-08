
const express = require("express");
const fetch = require('node-fetch');
const fs = require("fs");
const cors = require("cors");
const app = express();

const {onFullfild , readFileFail , readFileSUCSESS } = require("./utils.js");
const Db = require("./DBclass.js");


// app.set("view engine" , "html");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('DB/urls-bin'));///not in use
app.use(cors()); 
// app.use('/public', express.static(`./public`));
app.use(express.static('./client'));

const  dir = process.env.NODE_ENV === 'test' ? './DB-TEST' : './DB';


const dataBase = new Db;


// app.get("/" ,(request , response)=>{
//     response.render("index");
// })
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
  });

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


///add a chek - not to short a short url
app.post("/urlshorts" , (req , res)=>{
    const url = req.body.url;
    
    dataBase.readFile(`${dir}/urls-bin/short-urls.json`)
    .then((data)=>{
        return onFullfild(data ,url ,res);
    })
    .catch((err)=>{
        console.log(err , "in post wile reading file");
        // return res.send(err);
        return;
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

app.get("/all/statistic" , (req , res)=>{
    console.log("im here");
    dataBase.readFile(`${dir}/urls-bin/short-urls.json`)
    .then((data)=>{
        const bin = JSON.parse(data);
        return res.status(200).json(bin); 
    }).catch((err)=>{
        console.log("couldnt read data from db" , err);
        return res.status(200).send("couldnt read data from db"); 
    })
});

const PORT = process.env.PORT || 3000
app.listen( 3000 , ()=>{
    console.log(`listen at 3000`);
});


module.exports = app;
