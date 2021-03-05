

const button = document.getElementById("button");
const input = document.getElementById("input");
button.addEventListener("click" , ()=>{
    if(input.value){

        const data = { url: input.value};
        fetch("http://localhost:3000" , {
            method: "POST" ,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response)=>{
            response.json()
        }).then((result)=>{
            input.value= "";
            console.log(result);
    
        });

        // const data = { url: input.value};
        // const options = {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }
        // fetch("http://localhost:3000", options);
    }
});