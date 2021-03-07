const app = require(`./main.js`);
const supertest = require('supertest');
const request = supertest(app);
const { test, expect } = require("@jest/globals");
const fs = require("fs");

let counterBEFORE =0;

describe( "post method" ,  ()=>{
    test("shorturl already exist in the database" , async ()=>{
      const response = await request.post("/urlshorts")
      .send({url: "https://stackabuse.com/how-to-use-module-exports-in-node-js/" })
      .type("form");
      expect(response.status).toEqual(200);
      expect(response.text).toEqual("http://localhost:3000/81");
        
    });
    test("invalid url-there is no such website" , async ()=>{
        const response = await request.post("/urlshorts")
        .send({url: "https://stackabuse.com/33333ports-in-node556/32f" })
        .type("form");
        expect(response.status).toEqual(202);
        expect(response.text).toEqual("invalid website");  
        
        
    });
    test("able to post a new url" , async ()=>{
        const response = await request.post("/urlshorts")
        .send({url: "https://www.youtube.com/watch?v=iYYRH4apXDo" })
        .type("form");
        let currentBin = JSON.parse(fs.readFileSync("./DB-TEST/urls-bin/short-urls.json"));
        const expected = currentBin["https://www.youtube.com/watch?v=iYYRH4apXDo"]
        delete currentBin["https://www.youtube.com/watch?v=iYYRH4apXDo"];
        fs.writeFileSync("./DB-TEST/urls-bin/short-urls.json" ,JSON.stringify(currentBin, null, 4) );
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);  
        
        
    });
      
});

describe("get method to /:id - shorturl request" ,  ()=>{
    test("there is no short url with the id that provided" , async ()=>{
        const response = await request.get("/0");
        expect(response.status).toEqual(400);
        expect(response.text).toEqual("not found-there is not such url");
    });
    test("request to short url => shuld redirect " , async ()=>{
        const response = await request.get("/84");
        expect(response.status).toEqual(303);
        
    });
});

describe("get statistics" , ()=>{
    test("there is no statistic => short url doesnt exist" , async ()=>{
        const response = await request.get("/statistic/0");
        expect(response.status).toEqual(200);
        expect(response.text).toEqual("not found-there is no such url");
    });


    test("should get statistic of the url " , async ()=>{
        const response = await request.get("/statistic/84");
        const bin = JSON.parse(fs.readFileSync("./DB-TEST/urls-bin/short-urls.json"));
        const urlObj = bin["https://www.youtube.com/watch?v=OOV1Q4drTqcgfthytrh"];
        const redirectCountBefore = urlObj["redirectCount"]; //////
        counterBEFORE = redirectCountBefore;/////////////
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(urlObj);
    });
    
    test("redirectCount encres" , async ()=>{
       
        console.log(counterBEFORE , "global counter!");
        const binbefore = JSON.parse(fs.readFileSync("./DB-TEST/urls-bin/short-urls.json"));
        const urlObjbefore = binbefore["https://www.youtube.com/watch?v=OOV1Q4drTqcgfthytrh"]; 
        const redirectCount1 = urlObjbefore["redirectCount"];
        await request.get("/84");
        const binAfter = JSON.parse(fs.readFileSync("./DB-TEST/urls-bin/short-urls.json" ));
        
        const urlObjAfter = binAfter["https://www.youtube.com/watch?v=OOV1Q4drTqcgfthytrh"]; 
        const redirectCountAfter = urlObjAfter["redirectCount"];
        expect(++counterBEFORE).toEqual(redirectCountAfter);
       
    });
});





