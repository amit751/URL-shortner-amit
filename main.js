const express = require("express");
const app = express();
app.listen( 3000 , ()=>{
    console.log("listen at 3000")
});
app.get("/" , (request , response)=>{
    response.redirect(301 , "https://www.youtube.com/watch?v=ZITh-XIikgI" );
})