const app = require(`./main.js`);
const supertest = require('supertest');
const request = supertest(app);
const { test, expect } = require("@jest/globals");


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
        expect(response.status).toEqual(200);
        expect(response.text).toEqual("http://localhost:3000/81");  
      });

});


// it("Should save user to the database", async () => {
//     const res = await request(app).post('/api/shorturl/new')
//     .send({
//       url: "https://stackabuse.com/how-to-use-module-exports-in-node-js/"
//     })
//     .type('form'); // other wise it gets to the server as an empty object
//       expect(res.status).toBe(200);
//     //   expect(response.body).toEqual("http://localhost:3000/81");
// }); 




// t('Should save user to database', async done => {
//     const res = await request.post('/signup')
//       .send({
//         name: 'Zell',
//         email: 'testing@gmail.com'
//       })
//     done()
//   })



// it('gets the test endpoint', async done => {
//     const response = await request.get('/test')
  
//     expect(response.status).toBe(200)
//     expect(response.body.message).toBe('pass!')
//     done()
//   })

// detectOpenHandles






// describe("PUT REQUEST", () => {
  
//     // PUT
  
//     const requestBody = {
//       "my-todo": [
//           {
//               "priority": "3",
//               "date": "2021-02-23T01:53:19.792Z",
//               "text": "Putin is a friend of Stalin, and they all just a PUT massage",
//               "id": "riHLRh"
//           }
//       ]
//     };
    
//     const options = {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     };
    
//     test("can update a bin by id", async ()=>{
//       const response = await request(app).put('/b/3').send(options);
//       expect(response.body.record).toEqual(true);
//       expect(response.body['metadata']['id']).toEqual("3");
//     });
    
//     test("no new bin is created when updating", async () => {
//       let lengthBeforeRequest = fs.readdirSync("./server/db/bins").length;
      
//       await request(app).put('/b/3').send(options);
//       let lengthAfterRequest = fs.readdirSync("./server/db/bins").length;
//       expect(lengthAfterRequest).toBe(lengthBeforeRequest);
      
//     });
    
//     test("should reject illegal id appropriate response", async ()=>{
//       const response = await request(app).put('/b/re').send(options);
      
//       expect(`status:${response.status}, message:${response.text}`).toEqual("status:400, message:Bad Request - Invalid Bin Id provided");
//     });
    
//     test("should send an appropriate response if such bin not found", async ()=>{
//       const response = await request(app).put('/b/-1').send(options);
      
//       expect(`status:${response.status}, message:${response.text}`).toEqual("status:404, message:Not Found - Bin not found");
//     });
//   });